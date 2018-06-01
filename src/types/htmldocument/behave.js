import {implement} from '../protocol';
import {ISeqable, IHierarchy} from '../../protocols';
import {constantly, effect} from '../../core';
import {EMPTY} from '../../types/empty/construct';

function children(self){
  return ISeqable.seq(document.children);
}

export default effect(
  implement(IHierarchy, {parent: constantly(null), children, nextSibling: constantly(null), prevSibling: constantly(null)}));