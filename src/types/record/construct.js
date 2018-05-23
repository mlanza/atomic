import {doto, overload} from '../../core';
import {constructs} from '../../types/function';
import behave from "./behave";

function extend(Type){
  behave(Type);
  Type.create = constructs(Type);
  Type.from = function(attrs){
    return Object.assign(Object.create(Type.prototype), {attrs: attrs});
  }
}

function body(keys){
  return "this.attrs = {" + keys.map(function(key){
    return "'" + key + "': " + key;
  }).join(", ") + "};";
}

function record1(a){
  return doto(Function(a, body([a])), extend);
}

function record2(a, b){
  return doto(Function(a, b, body([a, b])), extend);
}

function record3(a, b, c){
  return doto(Function(a, b, c, body([a, b, c])), extend);
}

function record4(a, b, c, d){
  return doto(Function(a, b, c, d, body([a, b, c, d])), extend);
}

function record5(a, b, c, d, e){
  return doto(Function(a, b, c, d, e, body([a, b, c, d, e])), extend);
}

function recordN(...args){
  return doto(Function.apply(null, args.concat([body(args)])), extend);
}

export const record = overload(null, record1, record2, record3, record4, record5, recordN);