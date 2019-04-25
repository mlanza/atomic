import {mapa, first, doto, specify, includes, implement, constantly, juxt, count, filled, get, eq, gte, lte, maybe, spread, compact, apply, Nil, isNumber, Number, isString, String, isDate, Date, Function} from "cloe/core";
import {ICheckable} from "./protocols/icheckable/instance";
import {map, scoped, issue, describe, pred, or, and, want} from "./types";
import {_ as v} from "param.macro";

export * from "./types";
export * from "./protocols";
export * from "./protocols/concrete";

export function choice(options){
  return describe(`invalid choice`,
    pred(includes, options, null));
}

export function atLeast(n){
  return describe(`cannot have fewer than ${n}`,
    map(count, pred(gte, null, n)));
}

export function atMost(n){
  return describe(`cannot have more than ${n}`,
    map(count, pred(lte, null, n)));
}

export function exactly(n){
  return describe(`must have exactly ${n}`,
    map(count, pred(eq, null, n)));
}

export function between(min, max){
  return min == max ? describe(`must be ${min}`, pred(eq, null, min)) :
    describe(`must be between ${min} and ${max}`,
      or(
        describe(`must be greater than or equal to ${min}`, pred(gte, null, min)),
        describe(`must be less than or equal to ${max}`   , pred(lte, null, max))));
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
  return describe(`${start} must come before ${end}.`,
    supplied(lte, [start, end]));
}

export const email = want("e-mail address", /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i);
export const phoneNumber = want("phone number", /^(\d{3}-|\(\d{3}\) )\d{3}-\d{4}$/);
export const stateCode = want("state code", choice(['AL','AK','AS','AZ','AR','CA','CO','CT','DE','DC','FM','FL','GA','GU','HI','ID','IL','IN','IA','KS','KY','LA','ME','MH','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','MP','OH','OK','OR','PW','PA','PR','RI','SC','SD','TN','TX','UT','VT','VI','VA','WA','WV','WI','WY']));
export const zipCode = want("zip code", /^\d{5}(-\d{4})?$/);

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
    specify(ICheckable, {check}));

})();

(function(){

  function check(self, value){
    return isDate(value) ? null : [issue(Date)];
  }

  doto(Date,
    specify(ICheckable, {check}));

})();

(function(){

  function check(self, value){
    return isString(value) ? null : [issue(String)];
  }

  doto(String,
    specify(ICheckable, {check}));

})();

(function(){

  function check(self, value){
    return self.test(value) ? null : [issue(self)];
  }

  doto(RegExp,
    implement(ICheckable, {check}));

})();

(function(){

  function check(self, value){
    return self(value) ? null : [issue(self)];
  }

  doto(Function,
    specify(ICheckable, {check}));

})();