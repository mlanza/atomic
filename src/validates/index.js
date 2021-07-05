import * as _ from "atomic/core";
import * as p from "./protocols/concrete.js";
import {ICheckable, IExplains} from "./protocols.js";
import {anno, map, scoped, issue, issuing, catches, pred, or, and, choice} from "./types.js";

export * from "./types.js";
export * from "./protocols.js";
export * from "./protocols/concrete.js";

export function toPred(constraint){
  return function(obj){
    const issues = p.check(constraint, obj);
    return !issues;
  }
}

export function present(constraint){
  return or(_.isNil, constraint);
}

export function atLeast(n){
  return anno({type: 'at-least', n},
    map(_.count, pred(_.gte, null, n)));
}

export function atMost(n){
  return anno({type: 'at-most', n},
    map(_.count, pred(_.lte, null, n)));
}

export function exactly(n){
  return anno({type: 'exactly', n},
    map(_.count, pred(_.eq, null, n)));
}

export function between(min, max){
  return min == max ?
    anno({type: 'equal', value: min},
      pred(_.eq, null, min)) :
    anno({type: 'between', min, max},
      or(
        anno({type: 'min', min}, pred(_.gte, null, min)),
        anno({type: 'max', max}, pred(_.lte, null, max))));
}

export function keyed(keys){
  return _.apply(_.juxt, _.mapa(function(key){
    return _.get(?, key);
  }, keys));
}

export function supplied(cond, keys){
  return scoped(_.first(keys),
    map(keyed(keys), _.spread(_.filled(cond, _.constantly(true)))));
}

export function range(start, end){
  return anno({type: 'range', start, end},
    supplied(_.lte, [start, end]));
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

  const check = _.constantly(null);

  _.doto(_.Nil,
    _.implement(ICheckable, {check}));

})();

export function datatype(Type, pred, type){

  function check(self, value){
    return pred(value) ? null : [issue(Type)];
  }

  const explain = _.constantly({type});

  _.doto(Type,
    _.specify(IExplains, {explain}),
    _.specify(ICheckable, {check}));

}

datatype(Function, _.isFunction, "function");
datatype(Number, _.isNumber, "number");
datatype(Date, _.isDate, "date");
datatype(String, _.isString, "string");
datatype(RegExp, _.isRegExp, "regexp");
datatype(_.Nil, _.isNil, "nil");

(function(){

  function check(self, value){
    return self.test(value) ? null : [issue(self)];
  }

  _.doto(RegExp,
    _.implement(IExplains, {explain: _.constantly({type: "pattern"})}),
    _.implement(ICheckable, {check}));

})();


(function(){

  function check(self, value){
    return issuing(self(value), issue(self));
  }

  _.doto(Function,
    _.implement(IExplains, {explain: _.constantly({type: "predicate"})}),
    _.implement(ICheckable, {check}));

})();
