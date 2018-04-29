import {implement} from '../../protocol';
import {doto, overload, constructs} from '../../core';
import Record from '../../types/record/construct';
import IAssociative from '../../protocols/iassociative';
import ISeqable from '../../protocols/iseqable';
import ILookup from '../../protocols/ilookup';
import ICounted from '../../protocols/icounted';
import IMap from '../../protocols/imap';
import ISeq from '../../protocols/iseq';
import IRecord from '../../protocols/irecord';

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

function ofRecord(Type){
  Type.prototype = Object.create(Record.prototype);
  Type.prototype.constructor = Type;
}

function body(keys){
  return "this.attrs = {" + keys.map(function(key){
    return "'" + key + "': " + key;
  }).join(", ") + "};";
}

function record1(a){
  return doto(Function(a, body([a])), extend, ofRecord);
}

function record2(a, b){
  return doto(Function(a, b, body([a, b])), extend, ofRecord);
}

function record3(a, b, c){
  return doto(Function(a, b, c, body([a, b, c])), extend, ofRecord);
}

function record4(a, b, c, d){
  return doto(Function(a, b, c, d, body([a, b, c, d])), extend, ofRecord);
}

function record5(a, b, c, d, e){
  return doto(Function(a, b, c, d, e, body([a, b, c, d, e])), extend, ofRecord);
}

function recordN(...args){
  return doto(Function.apply(null, args.concat([body(args)])), extend, ofRecord);
}

export const record = overload(null, record1, record2, record3, record4, record5, recordN);