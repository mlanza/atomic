import * as _ from "atomic/core";
import {_ as v} from "param.macro";
import {IOptions} from "./instance";
export const options = IOptions.options;

export function json(req){
  return req |> IOptions.options(v, {
    credentials: "same-origin",
    headers: {
      "Accept": "application/json;odata=verbose",
      "Content-Type": "application/json;odata=verbose"
    }
  }) |> _.fmap(v, function(resp){
    return resp.json();
  });
}

export function method(req, method){
  return IOptions.options(req, {method: method});
}