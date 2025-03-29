import * as _ from "atomic/core";
import {ISet, IEmptyableCollection, ICollection} from "../../protocols.js";

function empty(self){
  self.clear();
}

function disj(self, value){
  self.delete(value);
}

function conj(self, value){
  self.add(value);
}

export default _.does(
  _.implement(IEmptyableCollection, {empty}),
  _.implement(ICollection, {conj}),
  _.implement(ISet, {disj, unite: conj}));
