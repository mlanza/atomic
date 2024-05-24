import * as _ from "atomic/core";

function log(...args){
  ILogger.log(_.config.logger, ...args);
}

export const ILogger = _.protocol({log});
