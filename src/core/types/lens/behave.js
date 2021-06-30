import {does} from "../../core.js";
import {implement, satisfies} from "../protocol.js";
import {comp} from "../function/concrete.js";
import {butlast, last, detect, map, lazySeq, remove, drop, dropWhile, take, takeWhile} from "../lazy-seq.js";
import {seq} from "../../protocols/iseqable/concrete.js";
import {get, getIn} from "../../protocols/ilookup/concrete.js";
import {includes} from "../../protocols/iinclusive/concrete.js";
import {first} from "../../protocols/iseq/concrete.js";
import {toArray} from "../../protocols/icoerceable/concrete.js";
import {reverse} from "../../protocols/ireversible/concrete.js";
import {downward} from "../../protocols/ihierarchy/concrete.js";
import * as icollection from "../../protocols/icollection/concrete.js";
import {emptyList} from "../../types/empty-list/construct.js";
import {cons} from "../../types/list/construct.js";
import {concat} from "../../types/concatenated/construct.js";
import {updateIn, assocIn} from "../../protocols/iassociative/concrete.js";
import {IFn, IPath, ISwap, IReset, IDeref, IMap, IHierarchy, ILookup, IAssociative, ICollection} from "../../protocols.js";

function path(self){
  return self.path;
}

function deref(self){
  return getIn(self.root, self.path);
}

function conj(self, value){
  return swap(self, icollection.conj(?, value));
}

function lookup(self, key){
  return self.constructor.create(self.root, icollection.conj(self.path, key));
}

function assoc(self, key, value){
  return swap(self, IAssociative.assoc(?, key, value));
}

function contains(self, key){
  return includes(keys(self), key);
}

function dissoc(self, key){
  return swap(self, IMap.dissoc(?, key));
}

function reset(self, value){
  return self.constructor.create(assocIn(self.root, self.path, value), self.path);
}

function swap(self, f){
  return self.constructor.create(updateIn(self.root, self.path, f), self.path);
}

function root(self){
  return self.constructor.create(self.root);
}

function children(self){
  return map(function(key){
    return self.constructor.create(self.root, icollection.conj(self.path, key));
  }, keys(self));
}

function keys(self){
  const value = deref(self);
  return satisfies(IMap, value) ? IMap.keys(value) : emptyList();
}

function vals(self){
  const value = deref(self);
  return map(get(value, ?), keys(self));
}

function siblings(self){
  const p = parent(self),
        ctx = toArray(butlast(self.path)),
        key = last(self.path);
  return map(function(key){
    return self.constructor.create(self.root, icollection.conj(ctx, key));
  }, remove(function(k){
    return k === key;
  }, p ? keys(p) : []));
}

function prevSiblings(self){
  const p = parent(self),
        ctx = toArray(butlast(self.path)),
        key = last(self.path);
  return map(function(key){
    return self.constructor.create(self.root, icollection.conj(ctx, key));
  }, reverse(toArray(take(1, takeWhile(function(k){
    return k !== key;
  }, p ? keys(p) : [])))));
}

function nextSiblings(self){
  const p = parent(self),
        ctx = toArray(butlast(self.path)),
        key = last(self.path);
  return map(function(key){
    return self.constructor.create(self.root, icollection.conj(ctx, key));
  }, drop(1, dropWhile(function(k){
    return k !== key;
  }, p ? keys(p) : [])));
}

const prevSibling = comp(first, prevSiblings);
const nextSibling = comp(first, nextSiblings);

function parent(self){
  return seq(self.path) ? self.constructor.create(self.root, butlast(self.path)) : null;
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

const descendants = downward(children);

export default does(
  implement(IPath, {path}),
  implement(ICollection, {conj}),
  implement(ILookup, {lookup}),
  implement(IAssociative, {assoc, contains}),
  implement(IMap, {keys, vals, dissoc}),
  implement(ISwap, {swap}),
  implement(IReset, {reset}),
  implement(IHierarchy, {root, children, parents, parent, closest, descendants, siblings, nextSiblings, nextSibling, prevSiblings, prevSibling}),
  implement(IDeref, {deref}));
