import {map, inc, into} from './cljs';
import Array from './types/array';

QUnit.test("map", function(assert){
  assert.deepEqual(into([], map(inc, [1, 2, 3])), [2, 3, 4]);
  assert.deepEqual(into([], map(inc), [1, 2, 3]), [2, 3, 4]);
});