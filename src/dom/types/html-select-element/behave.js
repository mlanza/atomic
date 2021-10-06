import * as _ from "atomic/core";
import * as mut from "atomic/transients";
import * as p from "../../protocols/concrete.js";
import {element, isElement} from "../element/construct.js";
import {IValue, IText} from "../../protocols.js";
import Symbol from "symbol";

function conj(self, entry){
  self.append(isElement(entry) ? entry : element("option", {value: _.key(entry)}, _.val(entry)));
}

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
  _.naming(?, Symbol("HTMLSelectElement")),
  _.implement(mut.ITransientCollection, {conj}),
  _.implement(mut.ITransientAppendable, {append: conj}),
  _.implement(IValue, {value}),
  _.implement(IText, {text}));
