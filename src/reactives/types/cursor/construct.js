import * as _ from "atomic/core";
import Symbol from "symbol";

export function Cursor(source, path, callbacks){
  this.source = source;
  this.path = path;
  this.callbacks = callbacks;
}

Cursor.prototype[Symbol.toStringTag] = "Cursor";

export function cursor(source, path){
  return new Cursor(source, path, _.weakMap());
}
