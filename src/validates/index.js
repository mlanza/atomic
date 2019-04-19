import {doto, specify, implement, constantly, isNumber, Number, isString, String, isDate, Date, matches} from "cloe/core";
import {ICheckable} from "./protocols/icheckable/instance";
import {issue} from "./types/issue";

export * from "./types";
export * from "./protocols";
export * from "./protocols/concrete";

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