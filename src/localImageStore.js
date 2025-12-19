// IndexedDB-backed image store for local-dev mode.
// Stores image Blobs without hitting localStorage quota.

const DB_NAME = 'our-2026-deck'
const DB_VERSION = 1
const STORE_NAME = 'images'

/** @returns {Promise<IDBDatabase>} */
function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)

    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }

    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error || new Error('Failed to open IndexedDB'))
  })
}

function txRequest(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error || new Error('IndexedDB request failed'))
  })
}

/**
 * @param {string} key
 * @param {Blob} blob
 */
export async function putImage(key, blob) {
  const db = await openDb()
  try {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    await txRequest(store.put(blob, key))
    await new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error || new Error('IndexedDB transaction failed'))
      tx.onabort = () => reject(tx.error || new Error('IndexedDB transaction aborted'))
    })
  } finally {
    db.close()
  }
}

/** @param {string} key */
export async function getImage(key) {
  const db = await openDb()
  try {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    return await txRequest(store.get(key))
  } finally {
    db.close()
  }
}

/** @param {string} key */
export async function deleteImage(key) {
  const db = await openDb()
  try {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    await txRequest(store.delete(key))
    await new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error || new Error('IndexedDB transaction failed'))
      tx.onabort = () => reject(tx.error || new Error('IndexedDB transaction aborted'))
    })
  } finally {
    db.close()
  }
}

