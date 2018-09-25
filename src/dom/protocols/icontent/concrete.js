import {overload, filter} from "cloe/core";
import IContent from "./instance";

function contents2(self, type){
  return filter(function(node){
    return node.nodeType === type;
  }, IContent.contents(self))
}

export const contents = overload(null, IContent.contents, contents2);