import * as _ from "atomic/core";
import {ITemplate} from "atomic/core";
import {IParams} from "../../protocols";
import {_ as v} from "param.macro";

function params(self, obj){
  const f = _.isFunction(obj) ? obj : _.merge(v, obj);
  return new self.constructor(
    _.str(
      self.url |> _.split(v, "?") |> _.first,
      self.url |> _.fromQueryString |> f |> self.xfq |> _.toQueryString), self.xfq);
}

function fill(self, params){
  return ITemplate.fill(_.str(self), params);
}

export const behaveAsURL = _.does(
  _.implement(IParams, {params}),
  _.implement(ITemplate, {fill}));