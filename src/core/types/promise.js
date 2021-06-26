export * from "./promise/construct.js";
export * from "./promise/concrete.js";
import Promise from "promise";
import behave from "./promise/behave.js";
behave(Promise);