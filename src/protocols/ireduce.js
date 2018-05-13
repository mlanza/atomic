import {protocol} from '../protocol';
import {overload} from "../core";
export const IReduce = protocol({
  _reduce: null
});

function reduce2(xf, coll){
  return IReduce._reduce(coll, xf, xf());
}

function reduce3(xf, init, coll){
  return IReduce._reduce(coll, xf, init);
}

export const reduce = overload(null, null, reduce2, reduce3);

function transduce3(xform, f, coll){
  return transduce4(xform, f, f(), coll);
}

function transduce4(xform, f, init, coll){
  return reduce(xform(f), init, coll);
}

export const transduce = overload(null, null, null, transduce3, transduce4);

export default IReduce;