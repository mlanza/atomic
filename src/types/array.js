import {slice} from "../core";
export * from "./array/construct";
import Array from "./array/construct";
import behave from "./array/behave";
behave(Array);

export const isArray = Array.isArray.bind(Array);
export {slice}