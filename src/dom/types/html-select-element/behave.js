import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {IValue, IText} from "../../protocols.js";

function access(f){

  function value1(self){
    return _.maybe(p.sel("option", self), _.detect(function(option){
      return option.selected;
    }, ?), f);
  }

  function value2(self, value){
    const options = p.sel("option", self);
    const chosen = _.detect(function(option){
      return f(option) == value;
    }, options);
    if (chosen) {
      _.each(function(option){
        const selected = f(option) == value;
        if (option.selected != selected) {
          option.selected = selected;
        }
      }, options);
    } else {
      throw new Error("Cannot set value — it is not an option.");
    }
  }

  return _.overload(null, value1, value2);

}

const text  = _.comp(_.either(?, ""), access(p.text)),
      value = access(p.value);

export default _.does(
  _.implement(IValue, {value}),
  _.implement(IText, {text}));
