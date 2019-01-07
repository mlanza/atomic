import {overload, does, implement, locate, query} from 'cloe/core';
import {IValue, IText} from "../../protocols";
import * as _ from 'cloe/core';
import {_ as v} from "param.macro";

function text1(self){
  return _.opt(query(self, "option"), locate(v, function(option){
    return option.selected;
  }), IText.text) || "";
}

function text2(self, value){
  _.opt(query(self, "option"), locate(v, function(option){
    return IText.text(option) == value;
  }), function(option){
    option.selected = true;
  });
}

const text = overload(null, text1, text2);

function value1(self){
  return _.opt(query(self, "option"), locate(v, function(option){
    return option.selected;
  }), IValue.value);
}

function value2(self, value){
  _.opt(query(self, "option"), locate(v, function(option){
    return IValue.value(option) == value;
  }), function(option){
    option.selected = true;
  });
}

const value = overload(null, value1, value2);

export default does(
  implement(IValue, {value}),
  implement(IText, {text}));