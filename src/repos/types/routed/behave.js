import * as _ from "atomic/core";
import {IQueryable, IParams, IOptions, IAddress, IIntercept} from "../../protocols.js";
import {IClonable, ITemplate, IFunctor, ICoerceable, IForkable, ISeq, IAssociative, IMap, ICollection, fromTask} from "atomic/core";
import {query} from "../request/behave.js";

function xform(xf){
  return function(self, ...args){
    return _.edit(self, "requests", _.mapa(_.apply(xf, ?, args), ?));
  }
}

function clone(self){
  return new self.constructor(self.requests);
}

function filled(self){
  return _.maybe(self, IAddress.addr, _.test(/\{[^{}]+\}/, ?), _.not);
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

export default _.does(
  _.implement(IClonable, {clone}),
  _.implement(_.ICoerceable, {toPromise: fromTask}),
  _.implement(_.IForkable, {fork}),
  _.implement(IQueryable, {query}),
  _.implement(_.ISeq, {first, rest}),
  _.implement(IAddress, {addr}),
  _.implement(ITemplate, {fill: xform(ITemplate.fill)}),
  _.implement(_.ICollection, {conj: xform(_.conj)}),
  _.implement(IIntercept, {intercept: xform(IIntercept.intercept)}),
  _.implement(_.IFunctor, {fmap: xform(_.fmap)}),
  _.implement(_.IAssociative, {assoc: xform(_.assoc)}),
  _.implement(_.IMap, {dissoc: xform(_.dissoc)}),
  _.implement(IParams, {params: xform(IParams.params)}),
  _.implement(IOptions, {options: xform(IOptions.options)}));
