import IInclusive from "./instance";
import {overload, identity} from "../../core";
import {ICollection, IYank} from "../../protocols";
import {fork} from "../../predicates";

export const includes = IInclusive.includes;

function include3(self, value, want){
  const has = includes(self, value);
  const f = want ? ICollection.conj : IYank.yank;
  want === has || f(self, value);
}

function include2(self, value){
  return include3(self, value, true);
}

export const include = overload(null, null, include2, include3);

export const transpose = fork(IInclusive.includes, IYank.yank, ICollection.conj);