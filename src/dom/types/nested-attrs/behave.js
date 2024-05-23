import * as _ from "atomic/core";
import * as $ from "atomic/shell";

function asText(obj){
  return _.mapa(function(entry){
    const key = entry[0], value = entry[1];
    return _.str(key, ": ", value, ";");
  }, _.seq(obj)).join(" ");
}

function deref(self){
  const text = self.element.getAttribute(self.key)
  return text == null ? {} : _.reduce(function(memo, pair){
    return _.conj(memo, pair);
  }, {}, _.mapa(function(text){
    return _.mapa(_.trim, _.split(text, ":"));
  }, _.compact(_.split(text, ";"))));
}

function lookup(self, key){
  return _.get(deref(self), key);
}

function contains(self, key){
  return _.contains(deref(self), key);
}

function assoc(self, key, value){
  self.element.setAttribute(self.key, asText(_.assoc(deref(self), key, value)));
}

function dissoc(self, key){
  self.element.setAttribute(self.key, asText(_.dissoc(deref(self), key)));
}

function keys(self){
  return _.keys(deref(self));
}

function vals(self){
  return _.vals(deref(self));
}

function includes(self, pair){
  return _.includes(deref(self), pair);
}

function omit(self, pair){
  self.element.setAttribute(self.key, asText(_.omit(deref(self), pair)));
}

function conj(self, pair){
  self.element.setAttribute(self.key, asText(_.conj(deref(self), pair)));
}

export default _.does(
  _.keying("NestedAttrs"),
  _.implement(_.IDeref, {deref}),
  _.implement(_.IMap, {keys, vals}),
  _.implement(_.IInclusive, {includes}),
  _.implement(_.IAssociative, {contains}),
  _.implement(_.ILookup, {lookup}),
  _.implement($.ITransientMap, {dissoc}),
  _.implement($.ITransientAssociative, {assoc}),
  _.implement($.ITransientOmissible, {omit}),
  _.implement($.ITransientCollection, {conj}));
