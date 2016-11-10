import {subj} from './core/function.js';
//export {} from './core/compare.js'; 
import * as compare from './core/compare.js';
export const eq  = subj(compare.eq);
export const gt  = subj(compare.gt);
export const gte = subj(compare.gte);
export const lte = subj(compare.lte);
export const lt  = subj(compare.lt);
