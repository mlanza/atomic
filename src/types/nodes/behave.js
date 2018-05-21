import {effect, overload, constantly, identity} from '../../core';
import {implement} from '../../protocol';
import {IHierarchicalSet, ISeq, INext, ISeqable} from '../../protocols';
import {nodes} from './construct';
import {EMPTY} from '../../types/empty/construct';
import {lazySeq} from '../../types/lazyseq/construct';
import {concatenated} from '../../types/concatenated/construct';

function map(f, xs){
  const coll = ISeqable.seq(xs);
  return coll ? lazySeq(f(ISeq.first(coll)), function(){
    return map(f, ISeq.rest(coll));
  }) : EMPTY;
}

function mapcat(f, colls){
  return concatenated(map(f, colls));
}

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
  return nodes(map(function(el){
    return el.parent;
  }, self));
}

function children(self){
  return nodes(mapcat(function(el){
    return el.children;
  }, self));
}

function nextSibling(self){
  return nodes(map(function(el){
    return el.nextSibling;
  }, self));
}

function prevSibling(self){
  return nodes(map(function(el){
    return el.previousSibling;
  }, self));
}

function seq(self){
  return self.nodes;
}

export default effect(
  implement(ISeqable, {seq}),
  implement(ISeq, {first, rest}),
  implement(INext, {next}),
  implement(IHierarchicalSet, {parent, children, nextSibling, prevSibling}));