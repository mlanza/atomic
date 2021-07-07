import {does, constructs} from "../../core.js";
import {implement} from "../protocol.js";
import {ICoercible, IReduce, ISeqable, ISeq, INext, IInclusive, IAppendable, IPrependable, ICounted, ISequential, IEmptyableCollection} from "../../protocols.js";
import {iterable} from "../lazy-seq/behave.js";
import * as p from "./protocols.js";

function seq(self){
  return p.seq(self.items);
}

function toArray(self){
  return p.toArray(self.items);
}

function first(self){
  return p.first(self.items);
}

function rest(self){
  return next(self) || empty(self);
}

function next(self){
  const items = p.next(self.items);
  return items ? self.constructor.from(items) : null;
}

function append(self, other){
  return self.constructor.from(p.append(self.items, other));
}

function prepend(self, other){
  return self.constructor.from(p.prepend(self.items, other));
}

function includes(self, name){
  return p.includes(self.items, name);
}

function count(self){
  return p.count(self.items);
}

function empty(self){
  return self.constructor.from([]);
}

function reduce(self, xf, init){
  return p.reduce(xf, init, self.items);
}

function construction(Type){
  Type.create = Type.create || constructs(Type);
  Type.from = Type.from || function(items){
    return Object.assign(Object.create(Type.prototype), {items: items});
  }
}

export default does(
  construction,
  iterable,
  implement(ISequential),
  implement(ICounted, {count}),
  implement(IInclusive, {includes}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend}),
  implement(IEmptyableCollection, {empty}),
  implement(ICoercible, {toArray}),
  implement(ISeqable, {seq}),
  implement(INext, {next}),
  implement(IReduce, {reduce}),
  implement(ISeq, {first, rest}));
