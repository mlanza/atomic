import {implement} from '../protocol';
import {IFunctor, IText, IHtml, IValue, IHideable, IMatch, IArray, IHierarchy, IContent, IInclusive, IFind, IEquiv, ICollection, INext, ISeq, IReduce, IKVReduce, ISeqable, ISequential, IIndexed, IEmptyableCollection, IShow, ICounted, IAppendable, IPrependable} from '../../protocols';
import {overload, identity, constantly, effect} from '../../core';
import Reduced, {isReduced, reduced, unreduced} from "../reduced";
import {concat} from "../concatenated/construct";
import {members} from "../members/construct";
import {cons} from "../list/construct";
import {comp} from "../function/concrete";
import {downward, upward, closest} from "../element/behave";
import {map, mapcat, compact} from "./concrete";
import EmptyList from '../emptylist/construct';

function fmap(self, f){
  return map(f, self);
}

function conj(self, value){
  return cons(value, self);
}

function reduce(self, xf, init){
  let memo = init,
      coll = seq(self);
  while(coll){
    memo = xf(memo, first(coll))
    if (isReduced(memo)) {
      break;
    }
    coll = next(coll);
  }
  return unreduced(memo);
}

function equiv(as, bs){
  const xs = seq(as),
        ys = seq(bs);
  return xs === ys || (IEquiv.equiv(first(xs), first(ys)) && IEquiv.equiv(rest(xs), rest(ys)));
}

function iterate(self){
  let state = self;
  return {
    next: function(){
      let result = ISeqable.seq(state) ? {value: ISeq.first(state), done: false} : {done: true};
      state = INext.next(state);
      return result;
    }
  };
}

function iterator(){
  return iterate(this);
}

export function iterable(Type){
  Type.prototype[Symbol.iterator] = iterator;
}

export function find(coll, key){
  return reducekv(coll, function(memo, k, v){
    return key === k ? reduced([k, v]) : memo;
  }, null);
}

function first(self){
  return self.head;
}

function rest(self){
  return self.tail();
}

function next(self){
  return ISeqable.seq(ISeq.rest(self));
}

function _show(self){
  var xs = IArray.toArray(ISeqable.seq(self));
  return "#" + self.constructor.name +  " [" + xs.map(IShow.show).join(", ") + "]";
}

function reduce(xs, xf, init){
  var memo = init,
      ys = ISeqable.seq(xs);
  while(ys && !(memo instanceof Reduced)){
    memo = xf(memo, ISeq.first(ys));
    ys = next(ys);
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
}

function reducekv(xs, xf, init){
  var memo = init,
      ys = ISeqable.seq(xs);
  while(ys && !(memo instanceof Reduced)){
    let pair = ISeq.first(ys);
    memo = xf(memo, pair[0], pair[1]);
    ys = next(ys);
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
}

function toArray2(xs, ys){
  if (ISeqable.seq(xs) != null) {
    ys.push(ISeq.first(xs));
    return toArray2(ISeq.rest(xs), ys);
  }
  return ys;
}

function toArray1(xs){
  return toArray2(xs, []);
}

function count(self){
  return reduce(self, function(memo){
    return memo + 1;
  }, 0);
}

function append(self, other){
  return concat(self, [other]);
}

function children(self){
  return members(mapcat(IHierarchy.children, self));
}

const descendants = comp(members, downward(IHierarchy.children));

function nextSibling(self){
  return members(fmap(self, IHierarchy.nextSibling));
}

function nextSiblings(self){
  return members(mapcat(IHierarchy.nextSiblings, self));
}

function prevSibling(self){
  return members(fmap(self, IHierarchy.prevSibling));
}

function prevSiblings(self){
  return members(fmap(self, IHierarchy.prevSiblings));
}

function siblings(self){
  return members(mapcat(IHierarchy.siblings, self));
}

function sel(self, selector){
  return members(filter(function(node){
    return IMatch.matches(node, selector);
  }, descendants(self)));
}

function parent(self){
  return members(fmap(self, IHierarchy.parent));
}

function parents(self){
  return members(mapcat(IHierarchy.parents, self));
}

function contents(self){
  return members(mapcat(IContent.contents, self));
}

function show(self){
  return IFunctor.fmap(self, IHideable.show);
}

function hide(self){
  return IFunctor.fmap(self, IHideable.hide);
}

function toggle(self){
  return IFunctor.fmap(self, IHideable.toggle);
}

const toArray = overload(null, toArray1, toArray2);

function text1(self){
  return compact(map(IText.text, self));
}

function text2(self, value){
  each(function(node){
    IText.text(node, value);
  }, self);
  return self;
}

export const text = overload(null, text1, text2);

function html1(self){
  return compact(map(IHtml.html, self));
}

function html2(self, value){
  each(function(node){
    IHtml.html(node, value);
  }, self);
  return self;
}

export const html = overload(null, html1, html2);

function value1(self){
  return compact(map(IValue.value, self));
}

function value2(self, value){
  each(function(node){
    IValue.value(node, value);
  }, self);
  return self;
}

export const value = overload(null, value1, value2);

export const itext  = implement(IText, {text});
export const ihtml  = implement(IHtml, {html});
export const ivalue = implement(IValue, {value});

export const ihideable = implement(IHideable, {show, hide, toggle});
export const ireduce = effect(
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}));

export default effect(
  iterable,
  ireduce,
  ihideable,
  itext,
  ihtml,
  ivalue,
  implement(ISequential),
  implement(IFunctor, {fmap}),
  implement(ICollection, {conj}),
  implement(IArray, {toArray}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend: conj}),
  implement(IReduce, {reduce}),
  implement(ICounted, {count}),
  implement(IEquiv, {equiv}),
  implement(IFind, {find}),
  implement(IContent, {contents}),
  implement(IHierarchy, {children, descendants, sel, nextSibling, nextSiblings, prevSibling, prevSiblings, siblings, parent, parents}),
  implement(IEmptyableCollection, {empty: EmptyList.EMPTY}),
  implement(ISeq, {first, rest}),
  implement(ISeqable, {seq: identity}),
  implement(INext, {next}));