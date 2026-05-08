import {does, comp} from "../../core.js";
import {implement} from "../protocol.js";
import {ISeqable, IFunctor, IDeref} from "../../protocols.js";
import {mapcat} from "../../types/lazy-seq/concrete.js";
import * as p from "../../protocols/concrete.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import series from "../../types/series/behave.js";
import {sequential} from "../../protocols/isequential/concrete";

function fmap(self, f){
  return new self.constructor(self.f(mapcat(comp(sequential, f), self.items)), self.f);
}

function seq(self){
  return p.seq(self.items);
}

function deref(self){
  return self.items;
}

export default does(
  series,
  keying("Members"),
  implement(IDeref, {deref}),
  implement(ISeqable, {seq}),
  implement(IFunctor, {fmap}));
