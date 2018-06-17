import {effect} from '../../core';
import {implement} from '../protocol';
import {ISeqable, ISequential, IContent, IHideable, IHierarchy} from '../../protocols';
import {lazySeq} from '../lazyseq/construct';
import {comp} from '../function/concrete';
import EmptyList from '../emptylist/construct';
import {iterable} from '../lazyseq/behave';

function seq2(self, idx){
  return idx < self.length ? lazySeq(self.item(idx), function(){
    return seq2(self, idx + 1);
  }) : EmptyList.EMPTY;
}

function seq(self){
  return seq2(self, 0);
}

const children = comp(IHierarchy.children, seq);
const descendants = comp(IHierarchy.descendants, seq);
const nextSibling = comp(IHierarchy.nextSibling, seq);
const nextSiblings = comp(IHierarchy.nextSiblings, seq);
const prevSibling = comp(IHierarchy.prevSibling, seq);
const prevSiblings = comp(IHierarchy.prevSiblings, seq);
const siblings = comp(IHierarchy.siblings, seq);
const sel = comp(IHierarchy.sel, seq);
const parent = comp(IHierarchy.parent, seq);
const parents = comp(IHierarchy.parents, seq);
const contents = comp(IContent.contents, seq);
const show = comp(IHideable.show, seq);
const hide = comp(IHideable.hide, seq);
const toggle = comp(IHideable.toggle, seq);

export default effect(
  iterable,
  implement(IContent, {contents}),
  implement(IHideable, {show, hide, toggle}),
  implement(IHierarchy, {parent, parent, nextSiblings, nextSibling, prevSiblings, prevSibling, siblings, children, descendants}),
  implement(ISequential),
  implement(ISeqable, {seq}));