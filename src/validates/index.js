import {doto, specify, implement, constantly, maybe, spread, compact, apply, Nil, isNumber, Number, isString, String, isDate, Date, matches} from "cloe/core";
import {ICheckable} from "./protocols/icheckable/instance";
import {issue, atLeast, atMost, exactly, and} from "./types";

export * from "./types";
export * from "./protocols";
export * from "./protocols/concrete";

export function cardinality(min, max){
  if (min != null && min < 0) {
    throw new Error("Minimum cardinality is 0.");
  }
  return min === max ? exactly(min) : and(maybe(min, atLeast), maybe(max, atMost));
}

(function(){

  const check = constantly(null);

  doto(Nil,
    implement(ICheckable, {check}));

})();

(function(){

  function check(self, text){
    return self(text);
  }

  doto(Function,
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
    return matches(self, value) ? null : [issue(self)];
  }

  doto(RegExp,
    implement(ICheckable, {check}));

})();