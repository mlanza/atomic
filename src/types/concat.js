import {identity, always, noop, slice, complement} from '../core';
import {extend} from '../protocol';
import Reduced from '../types/reduced';
import {EMPTY} from '../types/empty';
import List from '../types/list';
import Seq from '../protocols/seq';

export function Concat(){
  this.contents = arguments.length ? Coll.map(Coll.filter(slice(arguments), complement(Coll.isEmpty)), Seq.seq) : [];
}

export function concat(){
  var contents = arguments.length ? Coll.map(Coll.filter(slice(arguments), complement(Coll.isEmpty)), Seq.seq) : [],
      self     = new Concat();
  self.contents = contents;
  return self;
}

export function isEmpty(self){
  return self.contents.length === 0;
}

export function toArray(self){
  return Coll.toArray(seq(self));
}

export function toObject(self){
  return Coll.toObject(seq(self));
}

export function first(self){
  return Coll.first(seq(self));
}

export function rest(self){
  return Coll.rest(seq(self));
}

export function initial(self){
  return Coll.initial(seq(self));
}

export function append(self, value){
  return new Concat(self.contents, [value]);
}

export function each(self, f){
  Coll.each(seq(self), f);
}

export function reduce(self, f, init){
  return Coll.reduce(seq(self), f, init);
}

export function map(self, f){
  return Coll.map(seq(self), f);
}

export function filter(self, pred){
  return concat(Coll.filter(seq(self), pred));
}

export function find(self, pred){
  return Coll.find(seq(self), pred);
}

export function flatten(self){
  return Coll.flatten(seq(self));
}

export function seq(self){
  if (isEmpty(self)) return EMPTY;
  var fst = Coll.first(self.contents);
  return new List(Coll.first(fst), function(){
    return seq(concat.apply(this, [Coll.rest(fst)].concat(Coll.rest(self.contents))));
  });
}

export default Concat;

extend(Seq, Concat, {
  seq: seq
});