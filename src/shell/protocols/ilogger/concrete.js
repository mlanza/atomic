import {ILogger} from "./instance.js";
import config from "../../config.js";
export const log = ILogger.log;

export function warn(...args){
  const logger = config.logger || {};
  ILogger.log(logger["warn"], ...args);
}

export function error(...args){
  const logger = config.logger || {};
  ILogger.log(logger["error"], ...args);
}
