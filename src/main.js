export * from "./clojure";

/*
export * from "./pointfree";
import * as _ from "./pointfree";

function checkStatus(resp){
  return resp.ok ? Promise.resolve(resp) : Promise.reject(resp);
}

export const request = _.chain(_.request,
  _.update("pre", _.prepend(function(params){
    return Object.assign({
      credentials: "same-origin",
      method: "GET",
      headers: {
        "Accept": "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose"
      }
    }, params);
  })),
  _.update("post",
    _.pipe(
      _.append(checkStatus),
      _.append(function(resp){
        return resp.json();
      }),
      _.append(_.getIn(["d", "results"])))));
*/