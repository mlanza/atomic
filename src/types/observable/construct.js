import {publisher} from "../publisher";

export default function Obserable(publisher, state){
  this.publisher = publisher;
  this.state = state;
}

export function observable(init){
  return new Obserable(publisher(), init);
}