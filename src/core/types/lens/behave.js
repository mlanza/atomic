import {does, comp} from "../../core.js";
import {implement, satisfies} from "../protocol.js";
import {butlast, last, detect, map, lazySeq, remove, drop, dropWhile, take, takeWhile} from "../lazy-seq.js";
import {emptyList} from "../../types/empty-list/construct.js";
import {cons} from "../../types/list/construct.js";
import {concat} from "../../types/concatenated/construct.js";
import {IPath, ISwap, IReset, IDeref, IMap, IHierarchy, ILookup, IAssociative, ICollection} from "../../protocols.js";
import * as p from "./protocols.js";
import {naming} from "../../protocols/inamable/concrete.js";

function path(self){
  return self.path;
}

function deref(self){
  return p.getIn(self.root, self.path);
}

function conj(self, value){
  return swap(self, p.conj(?, value));
}

function lookup(self, key){
  return Object.assign(p.clone(self), {path: p.conj(self.path, key)})
}

function assoc(self, key, value){
  return swap(self, p.assoc(?, key, value));
}

function contains(self, key){
  return p.includes(keys(self), key);
}

function dissoc(self, key){
  return swap(self, p.dissoc(?, key));
}

function reset(self, value){
  return Object.assign(p.clone(self), {root: p.assocIn(self.root, self.path, value)});
}

function swap(self, f){
  return Object.assign(p.clone(self), {root: p.updateIn(self.root, self.path, f)});
}

function root(self){
  return Object.assign(p.clone(self), {path: []});
}

function children(self){
  return map(function(key){
    return Object.assign(p.clone(self), {path: p.conj(self.path, key)});
  }, keys(self));
}

function keys(self){
  const value = deref(self);
  return satisfies(IMap, value) ? p.keys(value) : emptyList();
}

function vals(self){
  const value = deref(self);
  return map(p.get(value, ?), keys(self));
}

function siblings(self){
  const p = parent(self),
        ctx = p.toArray(butlast(self.path)),
        key = last(self.path);
  return map(function(key){
    return Object.assign(p.clone(self), {path: p.conj(ctx, key)});
  }, remove(function(k){
    return k === key;
  }, p ? keys(p) : []));
}

function prevSiblings(self){
  const p = parent(self),
        ctx = p.toArray(butlast(self.path)),
        key = last(self.path);
  return map(function(key){
    return Object.assign(p.clone(self), {path: p.conj(ctx, key)});
  }, p.reverse(p.toArray(take(1, takeWhile(function(k){
    return k !== key;
  }, p ? keys(p) : [])))));
}

function nextSiblings(self){
  const p = parent(self),
        ctx = p.toArray(butlast(self.path)),
        key = last(self.path);
  return map(function(key){
    return Object.assign(p.clone(self), {path: p.conj(ctx, key)});
  }, drop(1, dropWhile(function(k){
    return k !== key;
  }, p ? keys(p) : [])));
}

const prevSibling = comp(p.first, prevSiblings);
const nextSibling = comp(p.first, nextSiblings);

function parent(self){
  return p.seq(self.path) ? Object.assign(p.clone(self), {path: butlast(self.path)}) : null;
}

function parents(self){
  return lazySeq(function(){
    const p = parent(self);
    return p ? cons(p, parents(p)) : emptyList();
  });
}

function closest(self, pred){
  return detect(comp(pred, deref), cons(self, parents(self)));
}

const descendants = p.downward(children);

export default does(
  naming("Lens"),
  implement(IPath, {path}),
  implement(ICollection, {conj}),
  implement(ILookup, {lookup}),
  implement(IAssociative, {assoc, contains}),
  implement(IMap, {keys, vals, dissoc}),
  implement(ISwap, {swap}),
  implement(IReset, {reset}),
  implement(IHierarchy, {root, children, parents, parent, closest, descendants, siblings, nextSiblings, nextSibling, prevSiblings, prevSibling}),
  implement(IDeref, {deref}));
