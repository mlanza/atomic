import {overload} from "../../core";
import {filter} from "../../types/lazy-seq/concrete";
import IContent from "./instance";

function contents2(self, type){
  return filter(function(node){
    return node.nodeType === type;
  }, IContent.contents(self))
}

export const contents = overload(null, IContent.contents, contents2);