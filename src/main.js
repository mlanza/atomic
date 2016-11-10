import {add} from './core';
import {log, chain, pipe, seq, toArray, toObject, reduce, trim, get, set, filter, eq} from './lib';

//TODO create a Pair constructor for kvps in an array?  better implement IMapEntry a thing with a key and a val.

QUnit.test("big ball of mud", function(assert){
  assert.ok(chain(" Mary Crawley ", trim) == "Mary Crawley");
  assert.ok(chain([1,2,3], reduce(add, 0), eq(6)));
  assert.deepEqual(chain({}, set("Larry", "Howard"), set("Moe", "Howard")), {"Larry": "Howard", "Moe": "Howard"});
  assert.deepEqual(chain({Moe: "Howard"}, toArray, toObject), {Moe: "Howard"});
  assert.deepEqual(chain({Moe: "Howard", Curly: "Howard", Larry: "Fine"}, filter(pipe(get(1), eq("Howard")))), {Moe: "Howard", Curly: "Howard"});
  assert.deepEqual(chain(["Ace", "King", "Queen"], set(0, "Jack")), ["Jack", "King", "Queen"]);
});