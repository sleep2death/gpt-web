import Fuse from 'fuse.js'
import { writable } from 'svelte/store';
import { getLocaleFromNavigator } from 'svelte-i18n';

const options = {
  // isCaseSensitive: false,
  // includeScore: false,
  // shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  // minMatchCharLength: 1,
  // location: 0,
  threshold: 0.1,
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  // fieldNormWeight: 1,
  keys: [
    "command",
    "label",
  ]
};

let fuse = null;
let collection = null
export const fuseResult = writable(null)

export async function search(pattern) {
  if (fuse === null) {
    const res = await fetch(`/public/prompts-${getLocaleFromNavigator()}.json`)
    collection = await res.json()
    fuse = new Fuse(collection, options);
  }

  if (pattern !== '') {
    fuseResult.set(fuse.search(pattern))
  } else {
    fuseResult.set(collection.map(val => ({
      item: Object.assign(val, {}),
      matches: [],
      score: 1
    })))
  }
}
