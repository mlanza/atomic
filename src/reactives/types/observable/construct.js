import {overload} from "cloe/core";
import {publisher} from "../publisher/construct";

export default function Observable(state, publisher, validate){
  this.state = state;
  this.publisher = publisher;
  this.validate = validate;
}

function observable0(){
  return observable1(null);
}

function observable1(init){
  return observable2(init, null);
}

function observable2(init, publ){
  return observable3(init, publ, null);
}

function observable3(init, publ, validate){
  return new Observable(init, publ || publisher(), validate);
}

export const observable = overload(observable0, observable1, observable2, observable3);