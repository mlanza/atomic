import * as _ from "atomic/core";
import {IValue} from "../../protocols.js";

function value1(self){
  switch (self.getAttribute("type")){
    case "checkbox":
      return self.checked;
    case "number":
    case "range":
      return _.maybe(self.value, _.blot, parseFloat);
    default:
      return "value" in self ? self.value : null;
  }
}

function value2(self, value){
  switch (self.getAttribute("type")){
    case "checkbox":
      self.checked = !!value;
      return;
    case "number":
    case "range":
      self.value = _.maybe(value, _.blot, parseFloat);
      return;
    default:
      if ("value" in self) {
        value = value == null ? "" : value;
        if (self.value != value) {
          self.value = value;
        }
      } else {
        throw new TypeError("Type does not support value property.");
      }
  }
}

export const value = _.overload(null, value1, value2);

export default _.does(
  _.implement(IValue, {value}));
