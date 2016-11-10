import * as core from './core';
import {curry} from './core';
export const arity    = curry(core.arity);
export const eq       = curry(core.eq);
export const add      = curry(core.add);
export const subtract = curry(core.subtract);