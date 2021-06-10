import * as _ from "atomic/core";
import {IIntercept} from "../../protocols.js"

export function demand(self, keys){
  return IIntercept.intercept(self, function(req){
    const params = _.remove(_.contains(req, ?), keys);
    if (_.seq(params)){
      throw new TypeError("Missing required params — " + _.join(", ", _.map(_.str("`", ?, "`"), params)) + ".");
    }
    return req;
  });
}