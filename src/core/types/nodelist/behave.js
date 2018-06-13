import {effect} from '../../core';
import {implement} from '../protocol';
import {ISeqable, ISequential} from '../../protocols';
import {lazySeq} from '../lazyseq/construct';
import EmptyList from '../emptylist/construct';
import {ishow, iterable} from '../lazyseq/behave';

function seq2(self, idx){
  return idx < self.length ? lazySeq(self.item(idx), function(){
    return seq2(self, idx + 1);
  }) : EmptyList.EMPTY;
}

function seq(self){
  return seq2(self, 0);
}

export default effect(
  ishow,
  iterable,
  implement(ISequential),
  implement(ISeqable, {seq}));