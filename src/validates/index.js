import {doto, specify, implement, constantly, isNumber, Number, isString, String, isDate, Date, matches} from "cloe/core";
import {ICheckable} from "./protocols/icheckable/instance";

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
    return isNumber(value);
  }

  function complaint(self){
    return "not a number";
  }

  doto(Number,
    specify(ICheckable, {check, complaint, terminal: constantly(true)}));

})();

(function(){

  function check(self, value){
    return isDate(value);
  }

  function complaint(self){
    return "not a date";
  }

  doto(Date,
    specify(ICheckable, {check, complaint, terminal: constantly(true)}));

})();

(function(){

  function check(self, value){
    return isString(value);
  }

  function complaint(self){
    return "not text";
  }

  doto(String,
    specify(ICheckable, {check, complaint, terminal: constantly(true)}));

})();

(function(){

  const check = matches;

  function complaint(self){
    return "must match the pattern";
  }

  doto(RegExp,
    implement(ICheckable, {check, complaint}));

})();