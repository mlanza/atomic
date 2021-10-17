import * as _ from "atomic/core";
import * as p from "./protocols/concrete.js";
import * as T from "./types.js";
export * from "./protocols.js";
export * from "./protocols/concrete.js";
export * from "./types.js";

_.ICoercible.multimethod
  |> _.addMethod(?, [_.key(T.TransientObject), _.key(Object)],
    function(self){
      return self.obj;
    })
