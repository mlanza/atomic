import {effect, overload, constantly, identity} from '../../core';
import {implement} from '../../protocol';
import {IHierarchy, ISeq, ISeqable, IIndexed, INext} from '../../protocols';
import {indexedNodeList} from '../indexednodelist/construct';
//import {nodeList} from '../nodelist/construct';
import {EMPTY} from '../empty/construct';
import {lazySeq} from '../lazyseq/construct';
import {concatenated} from '../concatenated/construct';

function map(f, xs){
  return ISeqable.seq(xs) ? lazySeq(f(ISeq.first(xs)), function(){
    return map(f, ISeq.rest(xs));
  }) : EMPTY;
}

function mapcat(f, colls){
  return concatenated(map(f, colls));
}

function first(self){
  return self.nodes[self.start];
}

function rest(self){
  return indexedNodeList(self.nodes, self.start + 1);
}

function next(self){
  let tail = rest(self);
  return tail === EMPTY ? null : tail;
}

function nth(self, idx){
  return idx < 0 ? null : self.nodes[self.start + idx];
}

function parent(self){
  return nodeList(map(function(el){
    return el.parent;
  }, self));
}

function children(self){
  return nodeList(mapcat(function(el){
    return nodeList(el.children);
  }, self));
}

function nextSibling(self){
  return nodeList(map(function(el){
    return el.nextSibling;
  }, self));
}

function prevSibling(self){
  return nodeList(map(function(el){
    return el.previousSibling;
  }, self));
}

export default effect(
  implement(ISeq, {first, rest}),
  implement(ISeqable, {seq: identity}),
  implement(IIndexed, {nth}),
  implement(INext, {next}),
  implement(IHierarchy, {parent, children, nextSibling, prevSibling}));