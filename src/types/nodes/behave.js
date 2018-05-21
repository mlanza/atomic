import {effect, overload, constantly, identity} from '../../core';
import {implement} from '../../protocol';
import {IHierarchicalSet, ISeq, INext, ISeqable} from '../../protocols';
import {nodes, toNodes, toFlatNodes} from './construct';
import {EMPTY} from '../../types/empty/construct';
import {lazySeq} from '../../types/lazyseq/construct';
import {concatenated} from '../../types/concatenated/construct';
import {showable, iterable} from '../lazyseq/behave';

function first(self){
  return ISeq.first(self.nodes);
}

function rest(self){
  return ISeq.rest(self.nodes);
}

function next(self){
  return INext.next(self.nodes);
}

function parent(self){
  return toNodes(function(el){
    return el.parentNode;
  }, ISeqable.seq(self));
}

function children(self){
  return toFlatNodes(function(el){
    return ISeqable.seq(el.children);
  }, ISeqable.seq(self));
}

function nextSibling(self){
  return toNodes(function(el){
    return el.nextElementSibling;
  }, ISeqable.seq(self));
}

function prevSibling(self){
  return toNodes(function(el){
    return el.previousElementSibling;
  }, ISeqable.seq(self));
}

export const hierarchical = implement(IHierarchicalSet, {parent, children, nextSibling, prevSibling});

export default effect(
  showable,
  iterable,
  hierarchical,
  implement(ISeqable, {seq: identity}),
  implement(ISeq, {first, rest}),
  implement(INext, {next}));