import {
  serieslike as behave,
  does,
  implement,
  satisfies,
  mapcat,
  IFunctor,
  ISeq,
  INext,
  ISequential
} from "cloe/core";
import {members, emptyMembers} from "./construct";

function fmap(self, f){
  return members(mapcat(function(item){
    const result = f(item);
    return satisfies(ISequential, result) ? result : [result];
  }, self.items));
}

function first(self){
  return ISeq.first(self.items);
}

function rest(self){
  const result = next(self);
  return result ? members(result) : emptyMembers();
}

function next(self){
  const result = INext.next(self.items);
  return result ? members(result) : null;
}

export default does(
  behave,
  implement(INext, {next}),
  implement(ISeq, {first, rest}),
  implement(IFunctor, {fmap}));