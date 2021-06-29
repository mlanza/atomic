import {IInclusive} from "./instance.js";
import {branch, constantly, overload} from "../../core.js";
import {yank} from "../iyankable/concrete.js";
import {conj} from "../icollection/concrete.js";

function excludes2(self, value){
  return !IInclusive.includes(self, value);
}

function includesN(self, ...args){
  for(let arg of args){
    if (!IInclusive.includes(self, arg)){
      return false;
    }
  }
  return true;
}

function excludesN(self, ...args){
  for(let arg of args){
    if (IInclusive.includes(self, arg)){
      return false;
    }
  }
  return true;
}

export const includes = overload(null, constantly(true), IInclusive.includes, includesN);
export const excludes = overload(null, constantly(false), excludes2, excludesN);
export const transpose = branch(IInclusive.includes, yank, conj);
