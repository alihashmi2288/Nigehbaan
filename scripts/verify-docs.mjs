import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const WEIGHTS = [0.30, 0.25, 0.20, 0.15, 0.10];

function calculateScore(factors, reporterType, phoneAccess) {
  let adjustedFactors = [...factors];
  
  // Vulnerability floor: no_phone enforces f3 >= 4.0
  if (phoneAccess === 'no_phone') {
    if (adjustedFactors[2] !== null && adjustedFactors[2] !== undefined) {
      adjustedFactors[2] = Math.max(adjustedFactors[2], 4.0);
    }
  }

  let knownWeightSum = 0;
  let knownWeightedScoreSum = 0;

  for (let i = 0; i < 5; i++) {
    const val = adjustedFactors[i];
    if (val !== null && val !== undefined) {
      const weight = WEIGHTS[i];
      knownWeightSum += weight;
      knownWeightedScoreSum += weight * (val / 5.0);
    }
  }

  if (knownWeightSum === 0) return 0.0;

  let score = 100 * (knownWeightedScoreSum / knownWeightSum);

  // Blind spot floor
  if (reporterType === 'system_blind_spot') {
    score = Math.max(score, 60.0);
  }

  return Math.round(score * 10) / 10;
}

const seedPath = path.join(rootDir, 'src', 'lib', 'simulation', 'seed.json');
const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

console.log('====================================================');
console.log('Nigehbaan Mathematical Triage & Seed Verifier');
console.log('====================================================\n');

let failed = 0;
console.log('| Code   | Extracted Factors         | Calc  | Expected | Status |');
console.log('| :----- | :------------------------ | :---: | :------: | :----: |');

for (const inc of seedData.incidents) {
  const calculated = calculateScore(inc.factors, inc.reporterType, inc.phoneAccess);
  const expected = inc.expectedScore;
  const match = Math.abs(calculated - expected) < 0.05;

  const factorsStr = JSON.stringify(inc.factors).padEnd(25);
  const calcStr = calculated.toFixed(1).padStart(5);
  const expStr = expected.toFixed(1).padStart(8);
  const statusStr = match ? '  PASS  ' : '  FAIL  ';

  console.log(`| ${inc.code.padEnd(6)} | ${factorsStr} | ${calcStr} | ${expStr} | ${statusStr} |`);

  if (!match) {
    failed++;
    console.error(`  ERROR: ${inc.code} mismatch! Calc: ${calculated}, Expected: ${expected}`);
  }
}

console.log('\n----------------------------------------------------');
if (failed === 0) {
  console.log('All 12 seed incidents verified mathematically! 100% consistent.');
  console.log('----------------------------------------------------');
  process.exit(0);
} else {
  console.error(`FAILED: ${failed} incident(s) failed mathematical verification.`);
  console.log('----------------------------------------------------');
  process.exit(1);
}
