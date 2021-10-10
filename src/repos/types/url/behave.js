import * as _ from "atomic/core";
import {IParams} from "../../protocols.js";

function params(self, obj){
  const f = _.isFunction(obj) ? obj : _.merge(?, obj);
  return new self.constructor(
    _.str(
      self.url |> _.split(?, "?") |> _.first,
      self.url |> _.fromQueryString |> f |> self.xfq |> _.toQueryString), self.xfq);
}

function fill(self, params){
  return _.fill(_.str(self), params);
}

export default _.does(
  _.naming("URL"),
  _.implement(IParams, {params}),
  _.implement(_.ITemplate, {fill}));
