import * as _ from "atomic/core";
import {IAssociative, IMap} from "../../protocols.js";

function assoc(self, key, value){
  self.set(key, value);
}

function dissoc(self, key, value){
  self.delete(key, value);
}

export default _.does(
  _.keying("Map"),
  _.implement(IMap, {dissoc}),
  _.implement(IAssociative, {assoc}));
