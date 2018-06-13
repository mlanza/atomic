import {overload} from "../../core";
import {publisher} from "../publisher";

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

function observable2(init, pub){
  return observable3(init, pub, null);
}

function observable3(init, pub, validate){
  return new Observable(init, pub || publisher(), validate);
}

export const observable = overload(observable0, observable1, observable2, observable3);