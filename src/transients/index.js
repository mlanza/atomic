import * as _ from "atomic/core";
import * as p from "./protocols/concrete.js";
import * as T from "./types.js";
export * from "./protocols.js";
export * from "./protocols/concrete.js";
export * from "./types.js";

_.ICoercible.addMethod([T.TransientObject, Object], function(self){
  return self.obj;
});
_.ICoercible.addMethod([T.TransientArray, Array], function(self){
  return self.arr;
});
_.ICoercible.addMethod([Set, Array], Array.from);
