import * as _ from "atomic/core";
import {transientObject} from "./construct.js";
import {IPersistent, ITransientOmissible, ITransientAssociative, ITransientEmptyableCollection, ITransientCollection, ITransientMap} from "../../protocols.js";

function omit(self, entry){
  const key = _.key(entry);
  if (_.includes(self, entry)) {
    delete self.obj[key];
  }
}

function conj(self, entry){
  const key = _.key(entry),
        val = _.val(entry);
  self.obj[key] = val;
}

function dissoc(self, key){
  if (_.contains(self, key)) {
    delete self.obj[key];
  }
}

function assoc(self, key, value){
  if (!_.contains(self, key) || !_.equiv(_.get(self, key), value)) {
    self.obj[key] = value;
  }
}

function clone(self){
  return transientObject(_.clone(self.obj));
}

function compare(a, b){
  return _.compare(a.obj, b == null ? null : b.obj);
}

function equiv(a, b){
  return _.equiv(a.obj, b == null ? null : b.obj);
}

function toObject(self){
  return self.obj;
}

function empty(self){
  self.obj = {};
}

function persistent(self){
  const obj = self.obj;
  delete self.obj;
  return obj;
}

export default _.does(
  _.forward("obj", _.IMap, _.IFind, _.IInclusive, _.ILookup, _.ISeq, _.INext, _.IAssociative, _.ISeqable, _.ICounted, _.IReduce, _.IKVReduce, _.ICoercible),
  _.implement(_.IComparable, {compare}),
  _.implement(_.ICoercible, {toObject}),
  _.implement(_.IFn, {invoke: _.get}),
  _.implement(_.IClonable, {clone}),
  _.implement(_.IEquiv, {equiv}),
  _.implement(IPersistent, {persistent}),
  _.implement(ITransientCollection, {conj}),
  _.implement(ITransientEmptyableCollection, {empty}),
  _.implement(ITransientAssociative, {assoc}),
  _.implement(ITransientMap, {dissoc}));
