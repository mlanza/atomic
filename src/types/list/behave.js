import {effect} from '../../core';
import {implement} from '../../protocol';
import {ISeq} from '../../protocols';
import behave from '../lazyseq/behave';

function first(self){
  return self.head;
}

function rest(self){
  return self.tail;
}

export default effect(
  behave,
  implement(ISeq, {first: first, rest: rest}));