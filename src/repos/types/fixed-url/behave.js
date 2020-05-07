import * as _ from "atomic/core";
import {ITemplate} from "atomic/core";
import {IParams} from "../../protocols";
import {_ as v} from "param.macro";

function fill(self, params){
  return ITemplate.fill(_.str(self), params);
}

export const behaveAsFixedURL = _.does(
  _.implement(IParams, {params: _.identity}),
  _.implement(ITemplate, {fill}));