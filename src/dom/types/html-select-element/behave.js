import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {IValue, IText, ISelectable} from "../../protocols.js";

function access(f, g){

  function _value1(self){
    return _.maybe(p.sel(self, "option"), _.detect(function(option){
      return option.selected;
    }, ?), f);
  }

  const value1 = g ? _.comp(g, _value1) : _value1;

  function value2(self, value){
    _.each(function(option){
      const selected = f(option) == value;
      if (option.selected != selected) {
        option.selected = selected;
      }
    }, p.sel(self, "option"));
  }

  return _.overload(null, value1, value2);

}

const text  = access(p.text, _.either(?, "")),
      value = access(p.value);

export default _.does(
  _.implement(IValue, {value}),
  _.implement(IText, {text}));
