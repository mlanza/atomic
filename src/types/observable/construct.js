import {publisher} from "../publisher";

export default function Observable(state, publisher){
  this.state = state;
  this.publisher = publisher;
}

export function observable(init, pub){
  return new Observable(init, pub || publisher());
}