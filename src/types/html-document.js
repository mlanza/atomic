import {identity, constantly, noop} from '../core';
import {extend} from '../protocol';
import IndexedSeq from './indexed-seq';
import Query from '../protocols/query';
import Hierarchy from '../protocols/hierarchy';
import Lookup from '../protocols/lookup';

export function fetch(self, selector){
  return self.querySelector(selector) || null;
}

export function query(self, selector){
  return new IndexedSeq(self.querySelectorAll(selector));
}

export const parent = constantly(null);
export const closest = constantly(null);
export const get = constantly(null);

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