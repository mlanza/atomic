import * as core from './core';
import {curry, flip} from './core';
import protocol from './protocol';
export const arity     = curry(core.arity);
export const eq        = curry(core.eq);
export const add       = curry(core.add);
export const subtract  = flip(core.subtract);
export const satisfies = flip(protocol.satisfies);