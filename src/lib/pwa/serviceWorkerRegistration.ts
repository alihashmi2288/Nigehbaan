/**
 * Nigehbaan Service Worker Registration Helper
 * Safely registers /sw.js in browser environments without blocking SSR.
 */

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    console.log('[Nigehbaan PWA] Service worker registered successfully. Scope:', registration.scope);
    return registration;
  } catch (error) {
    console.warn('[Nigehbaan PWA] Service worker registration failed:', error);
    return null;
  }
}

export async function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      return await registration.unregister();
    }
    return false;
  } catch (error) {
    console.warn('[Nigehbaan PWA] Error unregistering service worker:', error);
    return false;
  }
}
