import {subj} from './core/function.js';
export {toUpperCase, toLowerCase} from './core/string.js'; 
import * as String from './core/string.js';

export const append  = subj(String.append);
export const prepend = subj(String.prepend);
export const each    = subj(String.each);
export const reduce  = subj(String.reduce);
