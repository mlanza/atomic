import * as _ from "atomic/core";
import {IPersistent, ITransientMap, ITransientInsertable, ITransientEmptyableCollection, ITransientReversible, ITransientOmissible, ITransientAssociative, ITransientAppendable, ITransientPrependable, ITransientCollection} from "../../protocols.js";

function before(self, reference, inserted){
  const pos = self.indexOf(reference);
  pos === -1 || self.splice(pos, 0, inserted);
}

function after(self, reference, inserted){
  const pos = self.indexOf(reference);
  pos === -1 || self.splice(pos + 1, 0, inserted);
}

function append(self, value){
  self.push(value);
}

function prepend(self, value){
  self.unshift(value);
}

function unconj(self, value){
  const pos = self.lastIndexOf(value);
  if (pos > -1) {
    self.splice(pos, 1);
  }
}

function empty(self){
  self.length = 0;
}

function reverse(self){
  self.reverse();
}

function assoc(self, idx, value){
  self[idx] = value;
}

function dissoc(self, idx){
  self.splice(idx, 1);
}

function omit(self, value){
  let pos;
  while ((pos = self.indexOf(value)) > -1) {
    self.splice(pos, 1);
  }
}

function persistent(self){
  return self;
}

export default _.does(
  _.implement(IPersistent, {persistent}),
  _.implement(ITransientInsertable, {before, after}),
  _.implement(ITransientCollection, {conj: append, unconj}),
  _.implement(ITransientEmptyableCollection, {empty}),
  _.implement(ITransientOmissible, {omit}),
  _.implement(ITransientAssociative, {assoc}),
  _.implement(ITransientReversible, {reverse}),
  _.implement(ITransientMap, {dissoc}),
  _.implement(ITransientAppendable, {append}),
  _.implement(ITransientPrependable, {prepend}));
