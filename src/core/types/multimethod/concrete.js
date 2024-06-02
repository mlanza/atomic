import {hash} from "../../protocols/ihashable/concrete.js";

export function addMethod(self, key, handler){
  const hashcode = hash(key);
  const mm = self.behavior ? self.behavior : self;
  const potentials = (mm.methods[hashcode] = mm.methods[hashcode] || []);
  potentials.push([key, handler]);
  return self;
}
