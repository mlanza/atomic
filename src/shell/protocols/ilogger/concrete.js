import {ILogger} from "./instance.js";
import config from "../../config.js";
export const log = ILogger.log;

export function warn(...args){
  ILogger.log(config.logger?.["warn"], ...args);
}

export function error(...args){
  ILogger.log(config.logger?.["error"], ...args);
}
