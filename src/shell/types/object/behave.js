import * as _ from "atomic/core";
import {IPersistent, IOmissible, IAssociative, IEmptyableCollection, ICollection, IMap} from "../../../transients/protocols.js";

function omit(self, entry){
  const key = _.key(entry);
  if (_.includes(self, entry)) {
    delete self[key];
  }
}

function conj(self, entry){
  const key = _.key(entry),
        val = _.val(entry);
  self[key] = val;
}

function dissoc(self, key){
  if (_.contains(self, key)) {
    delete self[key];
  }
}

function assoc(self, key, value){
  if (!_.contains(self, key) || !_.equiv(_.get(self, key), value)) {
    self[key] = value;
  }
}

function empty(self){
  for(const key of Object.keys()){
    delete self[key];
  }
}

function persistent(self){
  return self;
}

export default _.does(
  _.implement(IPersistent, {persistent}),
  _.implement(ICollection, {conj}),
  _.implement(IEmptyableCollection, {empty}),
  _.implement(IAssociative, {assoc}),
  _.implement(IMap, {dissoc}));
