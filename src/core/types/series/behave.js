import {does, constructs} from "../../core";
import {implement} from '../protocol';
import {ICoerce, IReduce, IIndexed, ISeqable, ISeq, INext, IInclusive, IAppendable, IPrependable, ICounted, ILookup, IFn, ISequential, IEmptyableCollection} from '../../protocols';
import {iterable} from '../lazy-seq/behave';

function seq(self){
  return ISeqable.seq(self.items);
}

function toArray(self){
  return ICoerce.toArray(self.items);
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

function append(self, other){
  return self.constructor.from(IAppendable.append(self.items, other));
}

function prepend(self, other){
  return self.constructor.from(IPrependable.prepend(self.items, other));
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
  Type.create = Type.create || constructs(Type);
  Type.from = Type.from || function(items){
    return Object.assign(Object.create(Type.prototype), {items: items});
  }
}

export const behaveAsSeries = does(
  construction,
  iterable,
  implement(ISequential),
  implement(ICounted, {count}),
  implement(IInclusive, {includes}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend}),
  implement(IEmptyableCollection, {empty}),
  implement(ICoerce, {toArray}),
  implement(ISeqable, {seq}),
  implement(INext, {next}),
  implement(IReduce, {reduce}),
  implement(ISeq, {first, rest}));