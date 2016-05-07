import {subj} from './core/function.js';
import * as Array from './core/array.js';
export const slice = subj(Array.slice, 3);
export const join = subj(Array.join, 2);
export const last = subj(Array.last);
export const initial = subj(Array.initial);
