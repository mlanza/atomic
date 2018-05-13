import {doto, overload} from '../../core';
import {constructs} from '../../types/function';
import {implement} from '../../protocol';
import {IAssociative, ISeqable, ILookup, ICounted, IMap, ISeq, IRecord} from '../../protocols';

function contains(self, key){
  return self.attrs.hasOwnProperty(key);
}

function lookup(self, key){
  return self.attrs[key];
}

function seq(self){
  return ISeqable.seq(self.attrs);
}

function count(self){
  return Object.keys(self.attrs).length;
}

function first(self){
  return ISeq.first(seq(self));
}

function rest(self){
  return ISeq.rest(seq(self));
}

function extend(Type){

  function assoc(self, key, value){
    return Type.from(IAssociative.assoc(self.attrs, key, value));
  }

  function _dissoc(self, key){
    return Type.from(IMap.dissoc(self.attrs, key));
  }

  doto(Type,
    implement(IRecord),
    implement(IAssociative, {assoc: assoc, contains: contains}),
    implement(ILookup, {lookup: lookup}),
    implement(IMap, {_dissoc: _dissoc}),
    implement(ISeq, {first: first, rest: rest}),
    implement(ICounted, {count: count}),
    implement(ISeqable, {seq: seq}));

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