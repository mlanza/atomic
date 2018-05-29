import {unbind} from "../../core";
export const isArray = Array.isArray.bind(Array);
export const slice   = unbind(Array.prototype.slice);