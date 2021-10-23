import {overload, guard} from "../../core.js";
import {coalesce} from "../../types/lazy-seq/concrete.js";
import {append} from "../../protocols/iappendable/concrete.js";
import {concat} from "../../types/concatenated/construct.js";
import {apply} from "../../types/function/concrete.js";

function addRoute3(self, pred, f){
  return addRoute2(self, guard(pred, f));
}

function addRoute2(self, handler){
  self.handlers = append(self.handlers, handler);
  self.f = apply(coalesce, concat(self.handlers, [self.fallback]));
  return self;
}

export const addRoute = overload(null, null, addRoute2, addRoute3);
