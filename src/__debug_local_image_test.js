// Minimal sanity check for local-dev image persistence.
// Not used by the app; safe to delete anytime.

import { localStorageDB } from './localStorage'

export async function debugLocalImageTest() {
  // Fake minimal browser localStorage + FileReader not available in Node,
  // so this test is intended to be run in the browser console.
  //
  // Steps (paste into browser console on local dev):
  //   await import('/src/__debug_local_image_test.js').then(m => m.debugLocalImageTest())

  const acts = await localStorageDB.getActivities()
  const first = acts[0]
  console.log('First activity:', first)
  console.log('First image url:', localStorageDB.getImageUrl(first.image_path))
}

