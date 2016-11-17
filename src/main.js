import List from './types/list';
import Array from './types/array';
import Object from './types/object';
import HTMLDocument from './types/html-document';
import HTMLElement from './types/html-element';
import IndexedSeq from './types/indexed-seq';
import Reduce from './protocols/reduce';
import {log, chain, pipe, add, juxt, query, fetch, get, assoc, hasKey, first, second, third, rest, nth, next, count, reduce, each, map, filter, find, satisfies, concat, toArray, toObject} from './curried';
export {log, chain, pipe, add, juxt, query, fetch, get, assoc, hasKey, first, second, third, rest, nth, next, count, reduce, each, map, filter, find, satisfies, concat, toArray, toObject} from './curried';
export const nums = new IndexedSeq([11,12,13,14], 1);
export const letters = new IndexedSeq("grace");

QUnit.test("IndexedSeq", function(assert){
  assert.equal(chain(letters, first), "g");
  assert.equal(chain(letters, third), "a");
  assert.equal(chain(nums, first), 12);
  assert.equal(chain(nums, second), 13);
  assert.equal(chain(nums, count), 3);
  assert.ok(chain(nums, satisfies(Reduce)));
  assert.equal(chain(nums, reduce(add, 0)), 39);
  assert.deepEqual(chain([["Moe", "Howard"], ["Curly", "Howard"]], toObject), {Moe: "Howard", Curly: "Howard"});
  assert.deepEqual(chain({Moe: "Howard", Curly: "Howard"}, toArray), [["Moe", "Howard"], ["Curly", "Howard"]]);
});