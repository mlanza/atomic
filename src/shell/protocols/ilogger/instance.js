import * as _ from "atomic/core";
import config from "../../config.js";

function log(...args){
  ILogger.log(config.logger, ...args);
}

export const ILogger = _.protocol({log});
