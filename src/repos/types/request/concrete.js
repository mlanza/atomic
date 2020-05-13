import * as _ from "atomic/core";
import {_ as v} from "param.macro";
import {IIntercept} from "../../protocols"

export function demand(self, keys){
  return IIntercept.intercept(self, function(req){
    const params = _.remove(_.contains(req, v), keys);
    if (_.seq(params)){
      throw new TypeError("Missing required params — " + _.join(", ", _.map(_.str("`", v, "`"), params)) + ".");
    }
    return req;
  });
}