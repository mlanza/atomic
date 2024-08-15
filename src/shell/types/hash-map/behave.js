import * as _ from "atomic/core";
import {ICollection, IEmptyableCollection, IAssociative, IMap} from "../../protocols.js";
import * as p from "../../protocols/concrete.js";

function getHashIndex(self, key){
  const h = _.hash(key);
  const candidates = self.mapped[h] || null;
  const idx = _.detectIndex(function([k, v]){
    return _.equiv(key, k);
  }, candidates);
  return {h, idx, candidates};
}

function assoc(self, key, value){
  const {h, idx, candidates} = getHashIndex(self, key);
  if (!candidates) {
    p.assoc(self.mapped, h, [[key, value]]);
  } else if (idx == null) {
    p.update(self.mapped, h, _.conj(?, [key, value]));
  } else {
    p.assocIn(self.mapped, [h, idx], [key, value]);
  }
  if (idx == null) {
    self.length += 1;
  }
}

function dissoc(self, key){
  const {h, idx, candidates} = getHashIndex(self, key);
  if (idx == null) {
    return;
  }
  if (_.count(candidates) === 1) {
    p.dissoc(self.mapped, h);
  }
  p.assoc(self.mapped, h, _.filtera(function([k, v]){
    return !_.equiv(key, k);
  }, candidates));
  self.length -= 1;
}

function conj(self, [key, value]){
  assoc(self, key, value);
}

function empty(self){
  self.mapped = {};
  self.length = 0;
}

export default _.does(
  _.implement(ICollection, {conj}),
  _.implement(IEmptyableCollection, {empty}),
  _.implement(IMap, {dissoc}),
  _.implement(IAssociative, {assoc}));
