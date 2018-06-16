import {identity, constantly, effect, overload, subj} from '../../core';
import {implement} from '../protocol';
import {IReduce, ISeqable, ISeq, INext} from '../../protocols';
import behave from "../element/behave";
import {lazySeq} from "../lazyseq/construct";
import EmptyList from "../emptylist/construct";

function first(self){
  return ISeq.first(seq(self));
}

function rest(self){
  return next(self) || EmptyList.EMPTY;
}

function next(self){
  return seq(self, 1);
}

function seq2(self, idx){
  return idx < self.length ? lazySeq(self[idx], function(){
    return seq2(self, idx + 1);
  }) : null;
}

function seq(self){
  return seq2(self, 0);
}

function reduce(self, xf, init){
  return IReduce.reduce(self.childNodes, xf, init);
}

export default effect(
  behave,
  implement(INext, {next}),
  implement(ISeq, {first, rest}),
  implement(ISeqable, {seq}),
  implement(IReduce, {reduce}));