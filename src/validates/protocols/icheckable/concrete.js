import ICheckable from "./instance";
import {constantly, overload, branch, identity, complement, doto, fmap, toArray, seq, leaves, otherwise, deref, locate, path, reduce, lens, lazySeq, map, mapa, compact, take, drop, takeWhile, dropWhile, just, specify, comp, isFunction, juxt, isString, isPromise, Promise} from "cloe/core";
import {issue} from "../../types/issue/construct";
import {_ as v} from "param.macro";
export const check = ICheckable.check;

function batch(self, preds){
  const failures = mapa(function(pred){
    return fmap(check(pred, self), function(okay){
      return okay ? null : pred;
    });
  }, preds);
  //checks may be either synchronous or asynchronous
  const f = locate(failures, isPromise) ? comp(fmap(v, compact, toArray, seq), Promise.all) : comp(just, seq, toArray, compact);
  return f(failures);
}

function validateIssues(self, preds, issues){
  if (seq(issues) || !seq(preds)) {
    return issues;
  }
  const took = takeWhile(complement(terminal), preds);
  if (seq(took)){
    return otherwise(fmap(batch(self, took), validateIssues(self, dropWhile(complement(terminal), preds), v)), null);
  } else {
    return otherwise(fmap(batch(self, take(1, preds)), validateIssues(self, drop(1, preds), v)), null);
  }
}

function validate2(self, preds){
  return validateIssues(self, preds, null);
}

function validate3(self, parse, preds){
  let value = self;
  try{
    if (isString(value)) {
      value = parse(value);
    }
  } catch (ex) {
    return [issue(ex.message)];
  }
  return validate2(value, preds);
}

export const validate = overload(null, null, validate2, validate3);

const states = branch(isFunction, identity, constantly);

function terminal2(self, message){
  return doto(self,
    specify(ICheckable, {complaint: states(message), terminal: constantly(true)}));
}

export const terminal = overload(null, ICheckable.terminal, terminal2);

//permit message customization
function complaint2(self, message){
  return doto(self,
    specify(ICheckable, {complaint: states(message)}));
}

export const complaint = overload(null, ICheckable.complaint, complaint2);

export function validateIn(obj, validations){ //validate attributes
  return obj
    |> lens
    |> leaves
    |> map(juxt(path, deref), v)
    |> map(function(entry){
         const path = entry[0], value = entry[1];
         const issues = validate2(value, validations(path));
         return seq(issues) ? [path, value, issues] : null;
       }, v)
    |> compact;
}