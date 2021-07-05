import * as _ from "atomic/core";
import * as mut from "atomic/transients";

function toArray(self){
  return _.toArray(next2(self, 0));
}

function count(self){
  return self.node.attributes.length;
}

function lookup(self, key){
  return self.node.getAttribute(key);
}

function assoc(self, key, value){
  self.node.setAttribute(key, value);
}

function dissoc(self, key){
  self.node.removeAttribute(key);
}

function seq(self) {
  return count(self) ? self : null;
}

function first(self){
  return count(self) ? [self.node.attributes[0].name, self.node.attributes[0].value] : null;
}

function rest(self) {
  return next(self) || _.emptyList();
}

function next2(self, idx) {
  return idx < count(self) ? _.lazySeq(function(){
    return _.cons([self.node.attributes[idx].name, self.node.attributes[idx].value], next2(self, idx + 1));
  }) : null;
}

function next(self){
  return next2(self, 1);
}

function keys(self){
  return _.map(_.first, next2(self, 0));
}

function vals(self){
  return _.map(_.second, next2(self, 0));
}

function contains(self, key){
  return self.node.hasAttribute(key);
}

function includes(self, pair) {
  return lookup(self, _.key(pair)) == _.val(pair);
}

function empty(self){
  while(self.node.attributes.length > 0) {
    self.node.removeAttribute(self.node.attributes[0].name);
  }
}

export default _.does(
  _.implement(_.ICoerceable, {toArray}),
  _.implement(_.ICounted, {count}),
  _.implement(_.ISeqable, {seq}),
  _.implement(_.INext, {next}),
  _.implement(_.ISeq, {first, rest}),
  _.implement(_.IMap, {keys, vals}),
  _.implement(_.IInclusive, {includes}),
  _.implement(_.IAssociative, {contains}),
  _.implement(_.ILookup, {lookup}),
  _.implement(mut.ITransientMap, {dissoc}),
  _.implement(mut.ITransientEmptyableCollection, {empty}),
  _.implement(mut.ITransientAssociative, {assoc}));
