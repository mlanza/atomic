import {log, chain, pipe, add} from './core';
import {eq} from './curried';
import {seq} from './protocols/seq';
import {trim} from './protocols/trim';
import {reduce, filter, initial, first, rest, toArray, toObject} from './protocols/coll';
import {get, set} from './protocols/hash';
import * as list   from './types/list';
import * as empty  from './types/empty';
import * as string from './types/string';
import * as object from './types/object';
import * as array  from './types/array';
import * as nil    from './types/nil';
export {transduce, into, transform} from './transduce';
export {compose, chain, odd, add, log} from './core';
export {initial, first, rest, concat, each, filter, find, map, reduce, toObject, toArray} from './protocols/coll';
export {get, set, has} from './protocols/hash';
export {seq} from './protocols/seq';

//TODO create a Pair constructor for kvps in an array?  better implement IMapEntry a thing with a key and a val.

QUnit.test("big ball of mud", function(assert){
  assert.ok(chain(" Mary Crawley ", trim) == "Mary Crawley");
  assert.ok(chain([1,2,3], reduce(add, 0), eq(6)));
  assert.deepEqual(chain({}, set("Larry", "Howard"), set("Moe", "Howard")), {"Larry": "Howard", "Moe": "Howard"});
  assert.deepEqual(chain({Moe: "Howard"}, toArray, toObject), {Moe: "Howard"});
  assert.deepEqual(chain({Moe: "Howard", Curly: "Howard", Larry: "Fine"}, filter(pipe(get(1), eq("Howard")))), {Moe: "Howard", Curly: "Howard"});
  assert.deepEqual(chain(["Ace", "King", "Queen"], set(0, "Jack")), ["Jack", "King", "Queen"]);
  assert.deepEqual(chain(["Ace", "King", "Queen"], seq, first), "Ace");
  assert.deepEqual(chain(["Ace", "King", "Queen"], seq, initial, toArray), ["Ace", "King"]);
  assert.deepEqual(chain(["Ace", "King", "Queen"], seq, rest, toArray), ["King", "Queen"]);
});