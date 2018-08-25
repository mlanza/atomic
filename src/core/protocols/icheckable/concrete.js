import ICheckable from "./instance";
import {fmap} from "../ifunctor/concrete";
import {toArray} from "../iarray/concrete";
import {seq} from "../iseqable/concrete";
import {count} from "../icounted/concrete";
import {otherwise} from "../iotherwise/concrete";
import {reduce} from "../ireduce/concrete";
import {reduced} from "../../types/reduced";
import {lazySeq, detect, mapa, compact, take, drop, takeWhile, dropWhile} from "../../types/lazy-seq";
import {just} from "../../types/just/construct";
import {specify} from "../../types/protocol/concrete";
import {comp, isFunction} from "../../types/function";
import {all, isPromise} from "../../types/promise";
import {constantly, overload, branch, identity, complement, doto} from "../../core";
import {_ as v} from "param.macro";
export const check = ICheckable.check;
export const terminal = ICheckable.terminal;

const issues = branch(count, identity, constantly(null));

function batch(self, preds){
  const failures = mapa(function(pred){
    return fmap(check(pred, self), function(okay){
      return okay ? null : pred;
    });
  }, preds);
  //checks may be either synchronous or asynchronous
  const f = detect(isPromise, failures) ? comp(fmap(v, compact, toArray, issues), all) : comp(just, issues, toArray, compact);
  return f(failures);
}

function validate3(self, preds, issues){
  if (issues || !seq(preds)) {
    return issues;
  }
  const took = takeWhile(complement(terminal), preds);
  if (seq(took)){
    return otherwise(fmap(batch(self, took), validate3(self, dropWhile(complement(terminal), preds), v)), null);
  } else {
    return otherwise(fmap(batch(self, take(1, preds)), validate3(self, drop(1, preds), v)), null);
  }
}

export function validate(self, preds){
  return validate3(self, preds, null);
}

const states = branch(isFunction, identity, constantly);

//permit message customization
function complaint2(self, message){
  return doto(self,
    specify(ICheckable, {complaint: states(message)}, v));
}

export const complaint = overload(null, ICheckable.complaint, complaint2);