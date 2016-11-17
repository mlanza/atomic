import {identity, always, noop} from '../core';
import {extend} from '../protocol';
import {indexedSeq} from './indexed-seq';
import Query from '../protocols/query';
import Hierarchy from '../protocols/hierarchy';
import Lookup from '../protocols/lookup';

export function fetch(self, selector){
  return self.querySelector(selector) || null;
}

export function query(self, selector){
  return indexedSeq(self.querySelectorAll(selector));
}

export const parent = always(null);
export const closest = always(null);
export const get = always(null);

extend(Query, HTMLDocument, {
  query: query,
  fetch: fetch
});

extend(Hierarchy, HTMLDocument, {
  parent: parent,
  closest: closest
});

extend(Lookup, HTMLDocument, {
  get: get
});

export default HTMLDocument;