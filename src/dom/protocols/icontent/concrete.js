import * as _ from "atomic/core";
import {IContent} from "./instance.js";

function contents2(self, type){
  return _.filter(function(node){
    return node.nodeType === type;
  }, IContent.contents(self))
}

export const contents = _.overload(null, IContent.contents, contents2);
