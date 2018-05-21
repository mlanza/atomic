import {effect, overload, constantly, identity} from '../../core';
import {implement} from '../../protocol';
import {IHierarchicalSet, ISeq, ISeqable} from '../../protocols';
import {nodes} from '../nodes/construct';
import {EMPTY} from '../empty/construct';
import {lazySeq} from '../lazyseq/construct';
import {concatenated} from '../concatenated/construct';

function map(f, xs){
  const coll = ISeqable.seq(xs);
  return coll ? lazySeq(f(ISeq.first(coll)), function(){
    return map(f, ISeq.rest(coll));
  }) : EMPTY;
}

function mapcat(f, colls){
  return concatenated(map(f, colls));
}

function seq2(self, idx){
  return idx < self.length ? lazySeq(self.item(idx), function(){
    return seq2(self, idx + 1);
  }) : EMPTY;
}

function seq(self){
  return nodes(seq2(self, 0));
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

export default effect(
  implement(ISeqable, {seq}),
  implement(IHierarchicalSet, {parent, children, nextSibling, prevSibling}));