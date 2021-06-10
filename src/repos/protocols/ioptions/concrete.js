import * as _ from "atomic/core";
import {IOptions} from "./instance.js";
export const options = IOptions.options;

export function json(req){
  return req |> IOptions.options(?, {
    credentials: "same-origin",
    headers: {
      "Accept": "application/json;odata=verbose",
      "Content-Type": "application/json;odata=verbose"
    }
  }) |> _.fmap(?, function(resp){
    return resp.json();
  });
}

export function method(req, method){
  return IOptions.options(req, {method: method});
}