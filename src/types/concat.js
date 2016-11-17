import {identity, always, noop, slice, complement} from '../core';
import {extend} from '../protocol';
import Reduced from '../types/reduced';
import Seq from '../protocols/seq';
import Seqable from '../protocols/seqable';
import Reduce from '../protocols/reduce';
import {compact} from '../protocols/compact';
import {map} from '../coll';

export function Concat(){
  this.contents = arguments.length ? compact(map(arguments, Seqable.seq)) : [];
}

export function concat(){
  var contents = arguments.length ? compact(map(arguments, Seqable.seq)) : [],
      self     = new Concat();
  self.contents = contents;
  return self;
}

export function first(self){
  return self.contents.length === 0 ? null : Seq.first(Seq.first(self.contents));
}

export function rest(self){
  var fst = Seq.first(self.contents);
  return Seqable.seq(fst) ? concat.apply(this, [Seq.rest(fst)].concat(Seq.rest(self.contents))) : concat.apply(this, Seq.rest(self.contents));
}

export function seq(self){
  return self.contents.length === 0 ? null : self;
}

export function reduce(self, f, init){
  throw new "reduce not implemented"; //TODO
}

extend(Reduce, Concat, {
  reduce: reduce
});

extend(Seq, Concat, {
  first: first,
  rest: rest
});

extend(Seqable, Concat, {
  seq: seq
});

export default Concat;