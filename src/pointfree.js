import {curry, subj} from "./types";
import {overload} from "./core";
import * as p  from "./protocols";
import * as a from "./associatives";
import * as s from "./sequences";

export * from "./core";
export * from "./types";
export * from "./sequences";
export * from "./pipelines";
export * from "./protocols";

export const reduce = curry(p.reduce, 3);
export const append = subj(p.append);
export const prepend = subj(p.prepend);
export const conj = subj(p.conj);
export const invoke = subj(p.invoke);
export const find = subj(p.find);
export const dissoc = subj(p.dissoc);
export const pub = subj(p.pub);
export const sub = subj(p.sub);
export const includes = subj(p.includes);
export const get = subj(a.get);
export const getIn = subj(a.getIn);
export const assocIn = subj(a.assocIn);
export const update = subj(a.update);
