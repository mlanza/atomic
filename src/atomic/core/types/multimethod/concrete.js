import {IAssociative} from "../../protocols/iassociative/instance.js";
import {ILookup} from "../../protocols/ilookup/instance.js";

export function addMethod(self, key, handler){
  const mm = self.behavior ? self.behavior : self;
  mm.methods = IAssociative.assoc(mm.methods, key, handler);
}

export function method(self, ...args){
  const mm = self.behavior ? self.behavior : self;
  const key = mm.dispatch.apply(this, args);
  return ILookup.lookup(mm.methods, key);
}
