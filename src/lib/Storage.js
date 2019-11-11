import localforage from 'localforage';

localforage.config({
  driver      : localforage.LOCALSTORAGE, // Force WebSQL; same as using setDriver()
  name        : 'telegram',
  version     : 1.0,
  storeName   : 'telegram', // Should be alphanumeric, with underscores.
});

export default {
  get (key) {
    return localforage.getItem(key);
  },
  set(key, value) {
    if (typeof key === 'object') {
      const proms = Object.entries(key).map(([key, val]) => localforage.setItem(key, val));
      return Promise.all(proms);
    } else {
      return localforage.setItem(key, value);
    }
  },
  remove(...keys) {
    const proms = keys.map((key) => localforage.removeItem(key));
    return Promise.all(proms);
  },
  clear() {
    return localforage.clear();
  }
}
