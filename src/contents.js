import {overload} from "./core";
import {IContent} from "./protocols/icontent";
import {filter} from "./types";

function contents2(self, type){
  return filter(function(node){
    return node.nodeType === type;
  }, IContent.contents(self))
}

export const contents = overload(null, IContent.contents, contents2);
