import { describe, it, expect } from 'vitest';
import {
  DISTRICT_ALPHA_CENTER,
  DISTRICT_ALPHA_ZOOM,
  CARTO_DARK_MATTER_URL,
  CARTO_ATTRIBUTION,
  RESOURCE_STATION_COORDINATES,
  SHELTER_COORDINATES,
  isSectorBlindSpot,
  getSectorPolygonStyle,
  getPrioritySemanticColors,
  getShelterOccupancy,
  partitionIncidentsByCoordinates,
} from '@/components/map/mapUtils';
import { getPristineSectors, getPristineIncidents, getPristineShelters, getPristineResources } from '@/lib/simulation/seedLoader';

describe('Milestone 3: Tactical GIS Map & Utilities (Tasks T3.1 - T3.4)', () => {
  const sectors = getPristineSectors();
  const incidents = getPristineIncidents();
  const shelters = getPristineShelters();
  const resources = getPristineResources();

  describe('Task T3.1: Leaflet GIS Map Container & Dark Matter Tiles', () => {
    it('defines the correct District Alpha center coordinates and zoom level', () => {
      expect(DISTRICT_ALPHA_CENTER).toEqual([24.935, 67.145]);
      expect(DISTRICT_ALPHA_ZOOM).toBe(12);
    });

    it('uses CartoDB Dark Matter tile layer configuration', () => {
      expect(CARTO_DARK_MATTER_URL).toContain('basemaps.cartocdn.com/dark_all');
      expect(CARTO_ATTRIBUTION).toContain('OpenStreetMap');
      expect(CARTO_ATTRIBUTION).toContain('CARTO');
    });
  });

  describe('Task T3.2: Sector Polygons & Blind-Spot Styling', () => {
    it('contains all 4 operational sectors with closed polygon bounds', () => {
      expect(sectors).toHaveLength(4);
      const sectorIds = sectors.map((s) => s.id);
      expect(sectorIds).toEqual(['sector-1', 'sector-2', 'sector-3a', 'sector-4']);

      for (const sector of sectors) {
        expect(sector.bounds.length).toBeGreaterThanOrEqual(4);
        for (const [lat, lng] of sector.bounds) {
          expect(lat).toBeGreaterThan(24.8);
          expect(lat).toBeLessThan(25.1);
          expect(lng).toBeGreaterThan(67.0);
          expect(lng).toBeLessThan(67.3);
        }
      }
    });

    it('evaluates Sector 3A blind spot as inactive at T0 and T3', () => {
      const sector3a = sectors.find((s) => s.id === 'sector-3a')!;

      // Sector 3A at T0
      expect(isSectorBlindSpot(sector3a, 'T0', incidents)).toBe(false);
      const styleT0 = getSectorPolygonStyle(sector3a, 'T0', incidents);
      expect(styleT0.color).toBe('#23252a');
      expect(styleT0.dashArray).toBeUndefined();
      expect(styleT0.className).toBe('sector-polygon-normal');

      // Sector 3A at T3
      expect(isSectorBlindSpot(sector3a, 'T3', incidents)).toBe(false);
      const styleT3 = getSectorPolygonStyle(sector3a, 'T3', incidents);
      expect(styleT3.color).toBe('#23252a');
    });

    it('evaluates Sector 3A blind spot as active at T6 Grid Blackout with tangerine dashed styling', () => {
      const sector3a = sectors.find((s) => s.id === 'sector-3a')!;

      expect(isSectorBlindSpot(sector3a, 'T6', incidents)).toBe(true);
      const styleT6 = getSectorPolygonStyle(sector3a, 'T6', incidents);

      expect(styleT6.color).toBe('#DB6D28'); // --semantic-blind-spot
      expect(styleT6.fillColor).toBe('#DB6D28');
      expect(styleT6.dashArray).toBe('6, 6');
      expect(styleT6.className).toBe('sector-polygon-blind-spot');
      expect(styleT6.weight).toBeGreaterThanOrEqual(2);
    });

    it('evaluates non-blind-spot sectors with hairline styling even at T6', () => {
      const sector1 = sectors.find((s) => s.id === 'sector-1')!;
      const sector2 = sectors.find((s) => s.id === 'sector-2')!;
      const sector4 = sectors.find((s) => s.id === 'sector-4')!;

      for (const sector of [sector1, sector2, sector4]) {
        expect(isSectorBlindSpot(sector, 'T6', incidents)).toBe(false);
        const style = getSectorPolygonStyle(sector, 'T6', incidents);
        expect(style.color).toBe('#23252a');
        expect(style.dashArray).toBeUndefined();
      }
    });
  });

  describe('Task T3.3: Incident Markers with Priority Severity Rings', () => {
    it('partitions incidents correctly into 11 mapped and 1 unmapped (NG-112)', () => {
      const { mapped, unmapped } = partitionIncidentsByCoordinates(incidents);

      expect(mapped).toHaveLength(11);
      expect(unmapped).toHaveLength(1);

      expect(unmapped[0].code).toBe('NG-112');
      expect(unmapped[0].coordinates).toBeNull();
      expect(unmapped[0].uncertaintyFlags).toContain('MISSING_LOCATION');

      for (const m of mapped) {
        expect(Array.isArray(m.coordinates)).toBe(true);
        expect(m.coordinates).toHaveLength(2);
        expect(typeof m.coordinates[0]).toBe('number');
        expect(typeof m.coordinates[1]).toBe('number');
      }
    });

    it('assigns correct DESIGN.md semantic colors to all priority categories', () => {
      const criticalColors = getPrioritySemanticColors('Critical');
      expect(criticalColors.solid).toBe('#B42318');
      expect(criticalColors.border).toBe('#F04438');
      expect(criticalColors.text).toBe('#FDA29B');

      const highColors = getPrioritySemanticColors('High');
      expect(highColors.solid).toBe('#92400E');
      expect(highColors.border).toBe('#D97706');
      expect(highColors.text).toBe('#FDB022');

      const modColors = getPrioritySemanticColors('Moderate');
      expect(modColors.solid).toBe('#475569');
      expect(modColors.border).toBe('#64748B');

      const lowColors = getPrioritySemanticColors('Low');
      expect(lowColors.solid).toBe('#27a644');
      expect(lowColors.border).toBe('#12B76A');
    });

    it('identifies critical incidents NG-101 and NG-102 requiring pulsing rings', () => {
      const ng101 = incidents.find((i) => i.code === 'NG-101')!;
      const ng102 = incidents.find((i) => i.code === 'NG-102')!;

      expect(ng101.category).toBe('Critical');
      expect(ng101.coordinates).toEqual([24.9125, 67.1425]);

      expect(ng102.category).toBe('Critical');
      expect(ng102.coordinates).toEqual([24.9430, 67.1650]);
    });
  });

  describe('Task T3.4: Rescue Resource Stations & Shelter Markers', () => {
    it('defines valid station coordinates for all 6 rescue units', () => {
      expect(resources).toHaveLength(6);

      for (const res of resources) {
        const coords = RESOURCE_STATION_COORDINATES[res.id];
        expect(coords, `Missing station coords for ${res.id}`).toBeDefined();
        expect(coords).toHaveLength(2);
        expect(coords[0]).toBeGreaterThan(24.8);
        expect(coords[1]).toBeGreaterThan(67.0);
      }

      // Check shallow boats stationing
      expect(RESOURCE_STATION_COORDINATES['RES-01']).toEqual([24.922, 67.138]); // sector-2
      expect(RESOURCE_STATION_COORDINATES['RES-02']).toEqual([24.948, 67.158]); // sector-3a
    });

    it('calculates shelter occupancy percentages and detects SHL-03 critical failure', () => {
      expect(shelters).toHaveLength(3);

      const shl01 = shelters.find((s) => s.id === 'SHL-01')!;
      const shl02 = shelters.find((s) => s.id === 'SHL-02')!;
      const shl03 = shelters.find((s) => s.id === 'SHL-03')!;

      // SHL-01 (80/250 = 32%)
      const occ01 = getShelterOccupancy(shl01);
      expect(occ01.percentage).toBe(32);
      expect(occ01.isOvercrowded).toBe(false);
      expect(occ01.isGeneratorFailed).toBe(false);
      expect(occ01.statusBadgeColor).toBe('#27a644');

      // SHL-02 (84/120 = 70%)
      const occ02 = getShelterOccupancy(shl02);
      expect(occ02.percentage).toBe(70);
      expect(occ02.isOvercrowded).toBe(false);
      expect(occ02.isGeneratorFailed).toBe(false);

      // SHL-03 (388/400 = 97%, Generator FAILED)
      const occ03 = getShelterOccupancy(shl03);
      expect(occ03.percentage).toBe(97);
      expect(occ03.isOvercrowded).toBe(true);
      expect(occ03.isGeneratorFailed).toBe(true);
      expect(occ03.statusBadgeColor).toBe('#B42318');
      expect(occ03.statusText).toContain('CRITICAL');
    });

    it('defines valid coordinates for all 3 shelters', () => {
      for (const shl of shelters) {
        const coords = SHELTER_COORDINATES[shl.id];
        expect(coords, `Missing shelter coords for ${shl.id}`).toBeDefined();
        expect(coords).toHaveLength(2);
      }
    });
  });
});
