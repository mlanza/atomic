import {weakMap} from "cloe/core";

export default function Cursor(source, path, callbacks){
  this.source = source;
  this.path = path;
  this.callbacks = callbacks;
}

export function cursor(source, path){
  return new Cursor(source, path, weakMap());
}