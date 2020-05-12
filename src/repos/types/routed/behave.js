import * as _ from "atomic/core";
import {IParams, IOptions, IAddress, IIntercept} from "../../protocols";
import {ICloneable, ITemplate, IFunctor, IQueryable, ICoerceable, IForkable, ISeq, IAssociative, IMap, ICollection, fromTask} from "atomic/core";
import {query} from "../request/behave";
import {_ as v} from "param.macro";

function clone(self){
  return new self.constructor(self.requests);
}

function xform(xf){
  return function(self, ...args){
    return _.edit(self, "requests", _.mapa(_.apply(xf, v, args), v));
  }
}

function filled(self){
  return _.maybe(self, IAddress.addr, _.test(/\{[^{}]+\}/, v), _.not);
}

function fork(self, reject, resolve){
  return IForkable.fork(_.detect(filled, self.requests), reject, resolve);
}

function addr(self){
  return IAddress.addr(_.detect(filled, self.requests));
}

function first(self){
  return _.first(self.requests);
}

function rest(self){
  return _.rest(self.requests);
}

export const behaveAsRouted = _.does(
  _.implement(ICloneable, {clone}),
  _.implement(ICoerceable, {toPromise: fromTask}),
  _.implement(IForkable, {fork}),
  _.implement(IQueryable, {query}),
  _.implement(ISeq, {first, rest}),
  _.implement(IAddress, {addr}),
  _.implement(ICollection, {conj: xform(ICollection.conj)}),
  _.implement(IIntercept, {intercept: xform(IIntercept.intercept)}),
  _.implement(IFunctor, {fmap: xform(IFunctor.fmap)}),
  _.implement(IAssociative, {assoc: xform(IAssociative.assoc)}),
  _.implement(IMap, {dissoc: xform(IMap.dissoc)}),
  _.implement(IParams, {params: xform(IParams.params)}),
  _.implement(IOptions, {options: xform(IOptions.options)}));