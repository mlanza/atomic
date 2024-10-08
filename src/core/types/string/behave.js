import {ICompactible, ICloneable, IHashable, IIndexed, ISplittable, IReducible, IKVReducible, ICollection, ISeqable, ISeq, IInclusive, IAppendable, IPrependable, ILookup, IFn, IComparable, IEmptyableCollection} from "../../protocols.js";
import {does, identity, constantly, unbind, overload, isString} from "../../core.js";
import {implement} from "../protocol.js";
import {lazySeq} from "../lazy-seq/construct.js";
import {cons} from "../list/construct.js";
import {iindexed} from "../array/behave.js";
import {rePattern} from "../reg-exp/concrete.js";
import {emptyString} from "./construct.js";
import {replace} from "./concrete.js";
import * as p from "./protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {reduce, reducekv} from "../../shared.js";

const clone = identity;

function compact(str){
  return str.trim();
}

function split1(str){
  return str.split("");
}

function split3(str, pattern, n){
  const parts = [];
  while(str && n !== 0){
    let found = str.match(pattern);
    if (!found || n < 2) {
      parts.push(str);
      break;
    }
    let pos  = str.indexOf(found),
        part = str.substring(0, pos);
    parts.push(part);
    str = str.substring(pos + found.length);
    n = n ? n - 1 : n;
  }
  return parts;
}

const split = overload(null, split1, unbind(String.prototype.split), split3)

function compare(self, other){
  return self === other ? 0 : self > other ? 1 : -1;
}

function conj(self, other){
  return self + other;
}

function seq2(self, idx){
  return idx < self.length ? lazySeq(function(){
    return cons(self[idx], seq2(self, idx + 1));
  }) : null;
}

function seq(self){
  return seq2(self, 0);
}

function lookup(self, key){
  return self[key];
}

function first(self){
  return self[0] || null;
}

function rest(self){
  return self.substring(1) || "";
}

function prepend(self, head){
  return head + self;
}

function includes(self, str){
  return self.includes(str);
}

function hash(self) {
  var hash = 0,
    i, chr;
  if (self.length === 0) return hash;
  for (i = 0; i < self.length; i++) {
    chr = self.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
}

export default does(
  iindexed,
  keying("String"),
  implement(ICompactible, {compact}),
  implement(ICloneable, {clone}),
  implement(IHashable, {hash}),
  implement(ISplittable, {split}),
  implement(ICollection, {conj}),
  implement(IReducible, {reduce}),
  implement(IKVReducible, {reducekv}),
  implement(IComparable, {compare}),
  implement(IInclusive, {includes}),
  implement(IAppendable, {append: conj}),
  implement(IPrependable, {prepend}),
  implement(IEmptyableCollection, {empty: emptyString}),
  implement(IFn, {invoke: lookup}),
  implement(IIndexed, {nth: lookup}),
  implement(ILookup, {lookup}),
  implement(ISeqable, {seq}),
  implement(ISeq, {first, rest}));
