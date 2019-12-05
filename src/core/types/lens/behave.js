import {does} from "../../core";
import {implement, satisfies} from '../protocol';
import {comp} from '../function/concrete';
import {butlast, last, map, lazySeq, remove, drop, dropWhile, take, takeWhile} from "../lazy-seq";
import {seq} from '../../protocols/iseqable/concrete';
import {locate} from '../../protocols/ilocate/concrete';
import {get, getIn} from '../../protocols/ilookup/concrete';
import {includes} from '../../protocols/iinclusive/concrete';
import {first} from '../../protocols/iseq/concrete';
import {toArray} from '../../protocols/icoerceable/concrete';
import {reverse} from '../../protocols/ireversible/concrete';
import {downward} from "../../protocols/ihierarchy/concrete";
import * as icollection from "../../protocols/icollection/concrete";
import {emptyList} from "../../types/empty-list/construct";
import {cons} from "../../types/list/construct";
import {concat} from "../../types/concatenated/construct";
import {updateIn, assocIn} from "../../protocols/iassociative/concrete";
import {IFn, IPath, ISwap, IReset, IDeref, IMap, IHierarchy, ILookup, IAssociative, ICollection} from '../../protocols';
import {_ as v} from "param.macro";

function path(self){
  return self.path;
}

function deref(self){
  return getIn(self.root, self.path);
}

function conj(self, value){
  return swap(self, icollection.conj(v, value));
}

function lookup(self, key){
  return self.constructor.create(self.root, icollection.conj(self.path, key));
}

function assoc(self, key, value){
  return swap(self, IAssociative.assoc(v, key, value));
}

function contains(self, key){
  return includes(keys(self), key);
}

function dissoc(self, key){
  return swap(self, IMap.dissoc(v, key));
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
  return map(get(value, v), keys(self));
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
  return locate(cons(self, parents(self)), comp(pred, deref));
}

const descendants = downward(children);

export const behaveAsLens = does(
  implement(IPath, {path}),
  implement(ICollection, {conj}),
  implement(ILookup, {lookup}),
  implement(IAssociative, {assoc, contains}),
  implement(IMap, {keys, vals, dissoc}),
  implement(ISwap, {swap}),
  implement(IReset, {reset}),
  implement(IHierarchy, {root, children, parents, parent, closest, descendants, siblings, nextSiblings, nextSibling, prevSiblings, prevSibling}),
  implement(IDeref, {deref}));