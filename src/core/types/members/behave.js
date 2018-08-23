import {overload, identity, does} from "../../core";
import {implement, satisfies} from '../protocol';
import {IFunctor, ISeq, INext, ISequential} from '../../protocols';
import {mapcat} from "../lazy-seq/concrete";
import {reduced} from "../reduced/construct";
import Members, {members, emptyMembers} from "./construct";
import behave from "../series/behave";

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