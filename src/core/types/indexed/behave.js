import {overload, does} from "../../core.js";
import {IHashable, IKVReduce, IReduce, ICoercible, INext, IMap, ICounted, ISeq, ISeqable, ISequential, IIndexed, ILookup, IInclusive} from "../../protocols.js";
import {implement} from "../protocol.js";
import {indexedSeq} from "../indexed-seq/construct.js";
import {emptyList} from "../empty-list/construct.js";
import {some} from "../lazy-seq/concrete.js";
import ilazyseq, {iterable, reductive} from "../lazy-seq/behave.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {range} from "../../types/range/construct.js";
import {hashKeyed as hash} from "../../protocols/ihashable/concrete.js";

function count(self){
  return self.obj.length;
}

function nth(self, idx){
  return self.obj[idx];
}

function first(self) {
  return nth(self, 0);
}

function rest(self){
  return next(self) || emptyList();
}

function next(self){
  return count(self) > 1 ? indexedSeq(self, 1) : null;
}

function seq(self) {
  return count(self) ? self : null;
}

function includes(self, value){
  return !!some(function(x){
    return x === value;
  }, self);
}

function keys(self){
  return range(count(self));
}

export default does(
  iterable,
  reductive,
  keying("Indexed"),
  implement(IHashable, {hash}),
  implement(IMap, {keys}),
  implement(ISequential),
  implement(IInclusive, {includes}),
  implement(IIndexed, {nth}),
  implement(ILookup, {lookup: nth}),
  implement(INext, {next}),
  implement(ICoercible, {toArray: Array.from}),
  implement(ISeq, {first, rest}),
  implement(ISeqable, {seq}),
  implement(ICounted, {count}));
