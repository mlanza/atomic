import {overload, does} from "../../core.js";
import {Nil} from "../nil/construct.js";
import Symbol from "symbol";

const TEMPLATE = Symbol("@protocol-template"),
      INDEX    = Symbol("@protocol-index"),
      MISSING  = Symbol("@protocol-missing");

export function Protocol(template, index){
  this[INDEX] = index;
  this[TEMPLATE] = template;
}

export function protocol(template){
  const p = new Protocol({}, {});
  p.extend(template);
  return p;
}

Protocol.prototype.extend = function(template){
  for(let method in template){
    this[method] = this.dispatch(method);
  }
  Object.assign(this[TEMPLATE], template);
}

Protocol.prototype.dispatch = function(method){
  const protocol = this;
  return function(self, ...args){
    const f = satisfies2.call(protocol, method, self);
    if (!f) {
      throw new ProtocolLookupError(protocol, method, self, args);
    }
    return f.apply(null, [self].concat(args));
  }
}

Protocol.prototype.generate = function(){
  const index = this[INDEX];
  return function(method){
    const sym = index[method] || Symbol(method);
    index[method] = sym;
    return sym;
  }
}

Protocol.prototype.keys = function(){
  return Object.keys(this[TEMPLATE]);
}

function addMeta(target, key, value){
  try {
    Object.defineProperty(target, key, { //unsupported on some objects like Location
      configurable: true,
      enumerable: false,
      writable: true,
      value: value
    });
  } catch (ex) {
    target[key] = value;
  }
}

function specify1(behavior){
  const protocol = this;
  return function(target){
    specify2.call(protocol, behavior, target);
  }
}

function specify2(behavior, target){
  if (!this) {
    throw new Error("Protocol not specified.");
  }
  const keys = this.generate();
  addMeta(target, keys("__marker__"), this);
  for(let method in behavior){
    addMeta(target, keys(method), behavior[method]);
  }
}

Protocol.prototype.specify = overload(null, specify1, specify2);

function unspecify1(behavior){
  const protocol = this;
  return function(target){
    unspecify2.call(protocol, behavior, target);
  }
}

function unspecify2(behavior, target){
  const keys = this.generate();
  addMeta(target, keys("__marker__"), undefined);
  for(let method in behavior){
    addMeta(target, keys(method), undefined);
  }
}

Protocol.prototype.unspecify = overload(null, unspecify1, unspecify2);

export function implement0(){
  return implement1.call(this, {}); //marker interface
}

function implement1(obj){
  const behavior = obj.behaves ? obj.behaves(this) : obj;
  if (obj.behaves && !behavior) {
    throw new Error("Unable to borrow behavior.");
  }
  return Object.assign(implement2.bind(this, behavior), {protocol: this, behavior: behavior});
}

function implement2(behavior, target){
  let tgt = target.prototype;
  if (tgt.constructor === Object) {
    tgt = Object;
  }
  specify2.call(this, behavior, tgt);
}

Protocol.prototype.implement = overload(implement0, implement1, implement2);

function satisfies0(){
  return this.satisfies.bind(this);
}

function satisfies1(obj){
  const target = obj == null ? new Nil() : obj,
        key    = this[INDEX]["__marker__"] || MISSING;
  return target[key] || (target.constructor === Object ? target.constructor[key] : null);
}

//Everything inherits from Object.  The behaviors added to Object target only literals (e.g. `{}`) not everything!
function satisfies2(method, obj){
  const target = obj == null ? new Nil() : obj,
        key    = this[INDEX][method] || MISSING;
  return target[key] || (target.constructor === Object ? target.constructor[key] : null) || this[TEMPLATE][method];
}

Protocol.prototype.satisfies = overload(satisfies0, satisfies1, satisfies2);

export function ProtocolLookupError(protocol, method, subject, args) {
  this.protocol = protocol;
  this.method = method;
  this.subject = subject;
  this.args = args;
}

ProtocolLookupError.prototype = new Error();
ProtocolLookupError.prototype.toString = function(){
  return `Protocol lookup for ${this.method} failed.`;
}
