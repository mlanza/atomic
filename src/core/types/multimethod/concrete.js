import {hash} from "../../protocols/ihashable/concrete.js";

export function addMethod(self, key, handler){
  const hashcode = hash(key);
  const potentials = (self.methods[hashcode] = self.methods[hashcode] || []);
  potentials.push([key, handler]);
  return self;
}
