import * as _ from "atomic/core";

export function Cursor(source, path){
  this.source = source;
  this.path = path;
}

Cursor.prototype[Symbol.toStringTag] = "Cursor";

export const cursor = _.constructs(Cursor);
