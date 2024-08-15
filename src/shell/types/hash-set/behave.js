import * as _ from "atomic/core";
import {ICollection, IEmptyableCollection, ISet} from "../../protocols.js";
import * as p from "../../protocols/concrete.js";

function empty(self){
  self.coll = _.hashMap();
}

function conj(self, value){
  if (!_.includes(self, value)) {
    p.assoc(self.coll, value, value);
  }
}

function disj(self, value){
  if (_.includes(self, value)) {
    p.dissoc(self.coll, value)
  }
}

export default _.does(
  _.implement(ISet, {disj}),
  _.implement(IEmptyableCollection, {empty}),
  _.implement(ICollection, {conj}));
