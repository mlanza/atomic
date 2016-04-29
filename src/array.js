import {subj} from './core/function.js';
export {reverse, splice, concat} from './core/array.js'; //TODO review: splice, concat
import * as Array from './core/array.js';

export const slice   = subj(Array.slice, 3);
export const join    = subj(Array.join, 2);
export const append  = subj(Array.append);
export const prepend = subj(Array.prepend);
export const each    = subj(Array.each);
export const reduce  = subj(Array.reduce);
export const first   = subj(Array.first); //TODO consider affect of optional params: i.e. chain(["larry", "moe"], first()) vs chain(["larry", "moe"], first);
export const last    = subj(Array.last);
export const initial = subj(Array.initial);
export const rest    = subj(Array.rest);
