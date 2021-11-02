import {does} from "../../core.js";
import {satisfies, implement} from "../protocol.js";
import {ISequential, INext, ISeq, IFunctor} from "../../protocols.js";
import {mapcat} from "../../types/lazy-seq/concrete.js";
import * as p from "../../protocols/concrete.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import series from "../../types/series/behave.js";

function fmap(self, f){
  return new self.constructor(mapcat(function(item){
    const result = f(item);
    return satisfies(ISequential, result) ? result : [result];
  }, self.items), self.f);
}

function first(self){
  return p.first(self.items);
}

function rest(self){
  return new self.constructor(next(self) || [], self.f);
}

function next(self){
  const result = p.next(self.items);
  return result ? new self.constructor(result, self.f) : null;
}

export default does(
  series,
  keying("Members"),
  implement(INext, {next}),
  implement(ISeq, {first, rest}),
  implement(IFunctor, {fmap}));
