import {effect} from '../../core';
import {implement} from '../../protocol';
import {ISeqable} from '../../protocols';
import {lazySeq} from '../lazyseq/construct';
import {EMPTY} from '../empty/construct';
import {showable, iterable, hierarchical} from '../lazyseq/behave';

function seq2(self, idx){
  return idx < self.length ? lazySeq(self.item(idx), function(){
    return seq2(self, idx + 1);
  }) : EMPTY;
}

function seq(self){
  return seq2(self, 0);
}

export default effect(
  showable,
  iterable,
  hierarchical,
  implement(ISeqable, {seq}));