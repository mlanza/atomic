import {overload, identity} from "./core/core";
import {pipeline} from "./core/types/pipeline/construct";
import {append} from "./core/protocols/iappendable/concrete";
import {getIn} from "./core/protocols/ilookup/concrete";
import {_ as v} from "param.macro";
import fetch from "fetch";
import Promise from "promise";

function execute(req){
  return fetch(req.url, req);
}

function checkStatus(resp){
  return resp.ok ? Promise.resolve(resp) : Promise.reject(resp);
}

export const getJSON =
  pipeline() |>
    append(v, function(params){
      return Object.assign({
        credentials: "same-origin",
        method: "GET",
        headers: {
          "Accept": "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose"
        }
      }, params);
    }) |>
    append(v, execute, checkStatus) |>
    append(v, function(resp){
      return resp.json();
    }) |>
    append(v, getIn(v, ["d", "results"]));