import {overload, does} from "../../core.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {implement, satisfies} from "../protocol.js";
import {lazyIterable} from "../lazy-seq/concrete.js";
import {IFn, ICounted, IEmptyableCollection, ILookup, IAssociative, IMap, ICloneable, ISeqable} from "../../protocols.js";
import behave from "../object/behave.js";

function seq(self){
  return lazyIterable(self.entries());
}

function keys(self){
  return lazyIterable(self.keys());
}

function vals(self){
  return lazyIterable(self.values());
}

function clone(self){
  return new self.constructor(self);
}

function contains(self, key){
  return self.has(key);
}

function assoc(self, key, value){
  const other = clone(self);
  other.set(key, value);
  return other;
}

function dissoc(self, key){
  const other = clone(self);
  other.delete(key);
  return other;
}

function lookup(self, key){
  return self.get(key);
}

function count(self){
  return self.size;
}

function empty(self){
  return new self.constructor([]);
}

export default does(
  behave,
  keying("Map"),
  implement(ICloneable, {clone}),
  implement(IFn, {invoke: lookup}),
  implement(IEmptyableCollection, {empty}),
  implement(ICounted, {count}),
  implement(ILookup, {lookup}),
  implement(IAssociative, {contains, assoc}),
  implement(ISeqable, {seq}),
  implement(IMap, {dissoc, keys, vals}));
