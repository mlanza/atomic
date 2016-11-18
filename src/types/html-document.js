import {identity, constantly, noop} from '../core';
import {extend} from '../protocol';
import Query from '../protocols/query';
import Hierarchy from '../protocols/hierarchy';
import Lookup from '../protocols/lookup';
import IndexedSeq from './indexed-seq';

function fetch(self, selector){
  return self.querySelector(selector) || null;
}

function query(self, selector){
  return new IndexedSeq(self.querySelectorAll(selector));
}

export default extend(HTMLDocument, Query, {
  query: query,
  fetch: fetch
}, Hierarchy, {
  parent: constantly(null),
  closest: constantly(null)
}, Lookup, {
  get: constantly(null)
});