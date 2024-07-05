import {IAssociative} from "../../protocols/iassociative/instance.js";

export function addMethod(self, key, handler){
  const mm = self.behavior ? self.behavior : self;
  mm.methods = IAssociative.assoc(mm.methods, key, handler);
}
