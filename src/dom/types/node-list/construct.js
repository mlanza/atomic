import {global} from "atomic/core";
export const NodeList = global.NodeList;

export function isNodeList(self){
  return self.constructor === NodeList;
}
