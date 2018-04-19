import Nil from './types/nil/construct';

const REGISTRY = window.Symbol ? Symbol("Registry") : "Registry";

export function ProtocolLookupError(registry, subject, named, args) {
  this.registry = registry;
  this.subject = subject;
  this.named = named;
  this.args = args;
}

ProtocolLookupError.prototype = new Error();
ProtocolLookupError.prototype.toString = function(){
  return "Protocol lookup for " + this.named + " failed.";
}

function constructs(self){
  return self == null ? Nil : self.constructor;
}

export function Protocol(template){
  this[REGISTRY] = new WeakMap();
  extend(this, template);
}

function create(registry, named){
  return function(self) {
    var f = (registry.get(self) || {})[named] || (registry.get(constructs(self)) || {})[named];
    if (!f) {
      throw new ProtocolLookupError(registry, self, named, arguments);
    }
    return f.apply(this, arguments);
  }
}

export function extend(self, template){
  for (var key in template){
    self[key] = create(self[REGISTRY], key).bind(self);
  }
}

export function implement(self, type, impl){
  self[REGISTRY].set(type, impl);
}

export function protocol(template){
  return new Protocol(template);
}

export function extendType(type, protocol, impl){
  var rest = Array.prototype.slice.call(arguments, 3);
  implement(protocol, type, impl);
  if (rest.length){
    var args = [type].concat(rest);
    extendType.apply(null, args);
  }
}

export function reify(){
  var obj = {};
  extendType.apply(null, [obj].concat(Array.prototype.slice.call(arguments)));
  return obj;
}

export function satisfies(protocol, obj){
  return protocol[REGISTRY].has(obj.constructor);
}

export {Protocol as default};