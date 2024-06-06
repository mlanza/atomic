import * as _ from "atomic/core";
import {subject} from "../subject/construct.js";

export function Atom(state, observer, validate, primingSub){
  this.state = state;
  this.observer = observer;
  this.validate = validate;
  this.primingSub = primingSub;
}

Atom.prototype[Symbol.toStringTag] = "Atom";

function atom0(){
  return atom1(null);
}

export function atom(init, options = {}){
  const {observer = subject(), validate = null, primingSub = true} = options;
  return new Atom(init, observer, validate, primingSub);
}

