import {overload, identity, invokes} from "./core/core";
import {pipeline} from "./core/types/pipeline/construct";
import {append} from "./core/protocols/iappendable/concrete";
import {getIn, get} from "./core/protocols/ilookup/concrete";
import {absorb} from "./core/associatives";
import {assoc, update} from "./core/protocols/iassociative/concrete";
import {fork} from "./core/predicates";
import {emptyObject} from "./core/types/object/construct";
import {resolve, reject} from "./core/types/promise/concrete";
import fetch from "fetch";
import {_ as v} from "param.macro";

const checkStatus = fork(get(v, "ok"), resolve, reject);

export function request(req){
  return fetch(req.url, req).then(checkStatus);
}

export function headers(value){
  return update(v, "headers", function(was){
    return absorb(was || {}, value);
  });
}

export const requests =
  pipeline() |>
  append(v, emptyObject) |>
  append(v, assoc(v, "credentials", "same-origin")) |>
  append(v, request);

const json = pipe(
  before(v, request, assoc(v, "method", "GET")),
  before(v, request, headers({
    "Accept": "application/json;odata=verbose",
    "Content-Type": "application/json;odata=verbose"
  })),
  after(v, request, invokes(v, "json")),
  after(v, request, getIn(v, ["d", "results"])));

export const getJSON = json(requests);

export const getJSON2 =
  pipeline() |>
    append(v, emptyObject) |>
    append(v, assoc(v, "credentials", "same-origin")) |>
    append(v, assoc(v, "method", "GET")) |>
    append(v, headers({
      "Accept": "application/json;odata=verbose",
      "Content-Type": "application/json;odata=verbose"
    })) |>
    append(v, request, checkStatus) |>
    append(v, invokes(v, "json")) |>
    append(v, getIn(v, ["d", "results"]));