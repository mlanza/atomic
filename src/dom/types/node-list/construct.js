import {NodeList} from "dom";

export function isNodeList(self){
  return self.constructor === NodeList;
}
