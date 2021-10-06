import * as _ from "atomic/core";
import {members, emptyMembers} from "./construct.js";
import Symbol from "symbol";

function fmap(self, f){
  return members(_.mapcat(function(item){
    const result = f(item);
    return _.satisfies(_.ISequential, result) ? result : [result];
  }, self.items));
}

function first(self){
  return _.first(self.items);
}

function rest(self){
  const result = next(self);
  return result ? members(result) : emptyMembers();
}

function next(self){
  const result = _.next(self.items);
  return result ? members(result) : null;
}

export default _.does(
  _.serieslike,
  _.naming(?, Symbol("Members")),
  _.implement(_.INext, {next}),
  _.implement(_.ISeq, {first, rest}),
  _.implement(_.IFunctor, {fmap}));
