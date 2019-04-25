import {mapa, test, first, doto, specify, includes, identity, implement, constantly, branch, juxt, count, filled, get, eq, gte, lte, maybe, spread, compact, apply, Nil, isNumber, Number, isString, String, isDate, Date, Function} from "cloe/core";
import {ICheckable, IExplains} from "./protocols";
import {anno, map, scoped, issue, catches, pred, or, and} from "./types";
import {_ as v} from "param.macro";

export * from "./types";
export * from "./protocols";
export * from "./protocols/concrete";

export function toPred(constraint){
  return function(obj){
    const issues = ICheckable.check(constraint, obj);
    return !issues;
  }
}

export function choice(options){
  return anno({type: 'choice', options},
    pred(includes, options, null));
}

export function atLeast(n){
  return anno({type: 'at-least', n},
    map(count, pred(gte, null, n)));
}

export function atMost(n){
  return anno({type: 'at-most', n},
    map(count, pred(lte, null, n)));
}

export function exactly(n){
  return anno({type: 'exactly', n},
    map(count, pred(eq, null, n)));
}

export function between(min, max){
  return min == max ?
    anno({type: 'equal', value: min},
      pred(eq, null, min)) :
    anno({type: 'between', min, man},
      or(
        anno({type: 'min', min}, pred(gte, null, min)),
        anno({type: 'max', max}, pred(lte, null, max))));
}

export function cardinality(min, max){
  if (min != null && min < 0) {
    throw new Error("Minimum cardinality is 0.");
  }
  return min === max ? exactly(min) : and(maybe(min, atLeast), maybe(max, atMost));
}

export function keyed(keys){
  return apply(juxt, mapa(function(key){
    return get(v, key);
  }, keys));
}

export function supplied(cond, keys){
  return scoped(first(keys),
    map(keyed(keys), spread(filled(cond, constantly(true)))));
}

export function range(start, end){
  return anno({type: 'range', start, end},
    supplied(lte, [start, end]));
}

export const email =
  anno({type: "email"},
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i);

export const phone =
  anno({type: "phone"},
    /^(\d{3}-|\(\d{3}\) )\d{3}-\d{4}$/);

export const stateCode =
  anno({type: "state-code"},
    choice(['AL','AK','AS','AZ','AR','CA','CO','CT','DE','DC','FM','FL','GA','GU','HI','ID','IL','IN','IA','KS','KY','LA','ME','MH','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','MP','OH','OK','OR','PW','PA','PR','RI','SC','SD','TN','TX','UT','VT','VI','VA','WA','WV','WI','WY']));

export const zipCode =
  anno({type: "zip-code"},
    /^\d{5}(-\d{4})?$/);

(function(){

  const check = constantly(null);

  doto(Nil,
    implement(ICheckable, {check}));

})();

(function(){

  function check(self, value){
    return isNumber(value) ? null : [issue(Number)];
  }

  doto(Number,
    specify(IExplains, {explain: constantly({type: "number"})}),
    specify(ICheckable, {check}));

})();

(function(){

  function check(self, value){
    return isDate(value) ? null : [issue(Date)];
  }

  doto(Date,
    specify(IExplains, {explain: constantly({type: "date"})}),
    specify(ICheckable, {check}));

})();

(function(){

  function check(self, value){
    return isString(value) ? null : [issue(String)];
  }

  doto(String,
    specify(IExplains, {explain: constantly({type: "string"})}),
    specify(ICheckable, {check}));

})();

(function(){

  function check(self, value){
    return self.test(value) ? null : [issue(self)];
  }

  doto(RegExp,
    implement(IExplains, {explain: constantly({type: "pattern"})}),
    implement(ICheckable, {check}));

})();

(function(){

  function check(self, value){
    return value instanceof self ? null : [issue(self)];
  }

  doto(RegExp,
    specify(IExplains, {explain: constantly({type: "regex"})}),
    specify(ICheckable, {check}));

})();

(function(){

  function check(self, value){
    return self(value) ? null : [issue(self)];
  }

  doto(Function,
    implement(IExplains, {explain: constantly({type: "predicate"})}),
    implement(ICheckable, {check}));

})();

(function(){

  function check(self, value){
    return typeof value == "function" ? null : [issue(self)];
  }

  doto(Function,
    specify(IExplains, {explain: constantly({type: "function"})}),
    specify(ICheckable, {check}));

})();