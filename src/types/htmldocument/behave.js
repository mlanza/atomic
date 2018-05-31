import {implement} from '../protocol';
import {ISeqable, IHierarchy} from '../../protocols';
import {constantly, effect} from '../../core';
import {EMPTY} from '../../types/empty/construct';

function children(self){
  return [document.body];
}

function seq(self){
  return [document.body.parentElement];
}

export default effect(
  implement(ISeqable, {seq}),
  implement(IHierarchy, {parent: constantly(null), children, nextSibling: constantly(null), prevSibling: constantly(null)}));