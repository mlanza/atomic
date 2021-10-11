import {protocol} from "../../types/protocol.js";
import config from "../../config.js";

function log(...args){
  ILogger.log(config.logger, ...args);
}

export const ILogger = protocol({log});
