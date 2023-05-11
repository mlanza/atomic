import {overload, does} from "../../core.js";
import {Nil} from "../nil/construct.js";

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

const TEMPLATE = Symbol("@protocol-template"),
      INDEX    = Symbol("@protocol-index"),
      MISSING  = Symbol("@protocol-missing");

export function protocol(template){
  const p = new Protocol({}, {});
  p.extend(template);
  return p;
}

export function Protocol(template, index){
  this[INDEX] = index;
  this[TEMPLATE] = template;
}

function extend(template){
  for(let method in template){
    this[method] = this.dispatch(method);
  }
  Object.assign(this[TEMPLATE], template);
}

function dispatch(method){
  const protocol = this;
  return function(self, ...args){
    const f = satisfies2.call(protocol, method, self);
    if (!f) {
      throw new ProtocolLookupError(protocol, method, self, args);
    }
    return f.apply(null, [self, ...args]);
  }
}

function generate(){
  const index = this[INDEX];
  return function(method){
    const sym = index[method] || Symbol(method);
    index[method] = sym;
    return sym;
  }
}

function keys(){
  return Object.keys(this[TEMPLATE]);
}

function specify1(behavior){
  const protocol = this;
  return function(target){
    specify2.call(protocol, behavior, target);
  }
}

function specify2(behavior, target){
  if (this == null) {
    throw new Error("Protocol not specified.");
  }
  if (behavior == null || typeof behavior != "object") {
    throw new Error("Behavior must be an object map.");
  }
  if (target == null) {
    throw new Error("Subject not specified.");
  }
  const keys = this.generate();
  addMeta(target, keys("__marker__"), this);
  for(let method in behavior){
    if (!this[method]) {
      throw new Error("Foreign behavior specified: " + method);
    }
    addMeta(target, keys(method), behavior[method]);
  }
}

const specify = overload(null, specify1, specify2);

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

const unspecify = overload(null, unspecify1, unspecify2);

function implement0(){
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

const implement = overload(implement0, implement1, implement2);

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

const satisfies = overload(satisfies0, satisfies1, satisfies2);

Object.assign(Protocol.prototype, {extend, dispatch, generate, keys, specify, unspecify, implement, satisfies});

Protocol.prototype[Symbol.toStringTag] = "Protocol";

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
ProtocolLookupError.prototype[Symbol.toStringTag] = "ProtocolLookupError";
