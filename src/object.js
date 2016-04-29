import {subj} from './core/function.js';
export {constructs, assign, keys} from './core/object.js';
import * as Object from './core/object.js';
export const is      = subj(Object.is);
export const append  = subj(Object.append);
export const prepend = subj(Object.prepend);
export const each    = subj(Object.each);
export const reduce  = subj(Object.reduce);
