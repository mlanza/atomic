import {overload, guard} from "../../core.js";
import {coalesce} from "../../types/lazy-seq/concrete.js";
import {parsedo} from "../../types/function/concrete.js";
import {append} from "../../protocols/iappendable/concrete.js";
import {concat} from "../../types/concatenated/construct.js";
import {apply} from "../../types/function/concrete.js";
import {reGroups} from "../../types/reg-exp/concrete.js";
import {Router} from "./construct.js";

function addRoute3(self, pred, f){
  return addRoute2(self, guard(pred, f));
}

function addRoute2(self, handler){
  const handlers = append(self.handlers, handler);
  return new Router(
    handlers,
    self.fallback,
    apply(coalesce, concat(handlers, [self.fallback])));
}

function addRoute4(self, re, xf, f){
  return addRoute2(self, parsedo(reGroups(re, ?), xf, f));
}

export const addRoute = overload(null, null, addRoute2, addRoute3, addRoute4);
