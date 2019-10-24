import {overload, does, implement, locate, query, each, maybe, comp, either} from 'atomic/core';
import {IValue, IText} from "../../protocols";
import {_ as v} from "param.macro";

function access(f, g){

  function _value1(self){
    return maybe(query(self, "option"), locate(v, function(option){
      return option.selected;
    }), f);
  }

  const value1 = g ? comp(g, _value1) : _value1;

  function value2(self, value){
    each(function(option){
      const selected = f(option) == value;
      if (option.selected != selected) {
        option.selected = selected;
      }
    }, query(self, "option"));
  }

  return overload(null, value1, value2);

}

const text  = access(IText.text, either(v, "")),
      value = access(IValue.value);

export default does(
  implement(IValue, {value}),
  implement(IText, {text}));