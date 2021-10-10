import {does, constructs} from "../../core.js";
import {implement} from "../protocol.js";
import {ICoercible, IReduce, ISeqable, ISeq, INext, IInclusive, IAppendable, IPrependable, ICounted, ISequential, IEmptyableCollection} from "../../protocols.js";
import {iterable} from "../lazy-seq/behave.js";
import * as p from "./protocols.js";
import {naming} from "../../protocols/inamable/concrete.js";

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
  return items ? Object.assign(p.clone(self), {items}) : null;
}

function append(self, other){
  return Object.assign(p.clone(self), {items: p.append(self.items, other)});
}

function prepend(self, other){
  return Object.assign(p.clone(self), {items: p.prepend(self.items, other)});
}

function includes(self, name){
  return p.includes(self.items, name);
}

function count(self){
  return p.count(self.items);
}

function empty(self){
  return p.clone(self, {items: []});
}

function reduce(self, f, init){
  return p.reduce(f, init, self.items);
}

export default does(
  iterable,
  naming("Series"),
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
