import {ILogger} from "./instance.js";
export const log = ILogger.log;

export function warn(...args){
  ILogger.log(_.config.logger?.["warn"], ...args);
}

export function error(...args){
  ILogger.log(_.config.logger?.["error"], ...args);
}
