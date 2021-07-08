import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";

export function demand(self, keys){
  return p.intercept(self, function(req){
    const params = _.remove(_.contains(req, ?), keys);
    if (_.seq(params)){
      throw new TypeError("Missing required params — " + _.join(", ", _.map(_.str("`", ?, "`"), params)) + ".");
    }
    return req;
  });
}
