import {effect} from "../../core";
import {implement} from '../protocol';
import {IReduce, IIndexed, ISeqable, ISeq, IArr, INext, IInclusive, IAppendable, IPrependable, ICounted, ILookup, IFn, ISequential, IEmptyableCollection} from '../../protocols';
import {iterable} from '../lazyseq/behave';
import {constructs} from '../function';

function seq(self){
  return ISeqable.seq(self.items);
}

function toArray(self){
  return IArr.toArray(self.items);
}

function first(self){
  return ISeq.first(self.items);
}

function rest(self){
  return next(self) || empty(self);
}

function next(self){
  const args = INext.next(self.items);
  return args ? self.constructor.from(args) : null;
}

function toArray(self){
  return IArr.toArray(self.items);
}

function append(self, last){
  return self.constructor.from(IAppendable.append(self.items, last));
}

function prepend(self, first){
  return self.constructor.from(IPrependable.prepend(self.items, first));
}

function includes(self, name){
  return IInclusive.includes(self.items, name);
}

function count(self){
  return ICounted.count(self.items);
}

function empty(self){
  return self.constructor.from([]);
}

function reduce(self, xf, init){
  return IReduce.reduce(self.items, xf, init);
}

function construction(Type){
  Type.create = constructs(Type);
  Type.from = function(items){
    return Object.assign(Object.create(Type.prototype), {items: items});
  }
}

export default effect(
  construction,
  iterable,
  implement(ISequential),
  implement(ICounted, {count}),
  implement(IInclusive, {includes}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend}),
  implement(IEmptyableCollection, {empty}),
  implement(IArr, {toArray}),
  implement(ISeqable, {seq}),
  implement(INext, {next}),
  implement(IReduce, {reduce}),
  implement(ISeq, {first, rest}));