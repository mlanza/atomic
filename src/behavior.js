import * as types from "./types";
import {unbind} from "./core";
import behaveArray from "./types/array/behave";
behaveArray(Array);

export const isArray = Array.isArray.bind(Array);
export const slice   = unbind(Array.prototype.slice);
