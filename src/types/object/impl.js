import {EMPTY_OBJECT, constantly} from '../../core';
import {objectSelection} from '../../types/objectselection';
import {extendType} from '../../protocol';
import ISeqable, {seq} from '../../protocols/iseqable';
import IShow, {show} from '../../protocols/ishow';
import ICounted, {count} from '../../protocols/icounted';
import IAssociative from '../../protocols/iassociative';
import IEmptyableCollection from '../../protocols/iemptyablecollection';
import ILookup from '../../protocols/ilookup';
import {first, rest, toArray} from "../../protocols/iseq";

extendType(Object, ILookup, {
  lookup: function(self, key){
    return self[key];
  }
}, IEmptyableCollection, {
  empty: constantly(EMPTY_OBJECT)
}, IAssociative, {
  assoc: function(self, key, value){
    var obj = Object.assign({}, self);
    obj[key] = value;
    return obj;
  },
  containsKey: function(self, key){
    return self.hasOwnProperty(key);
  }
}, ISeqable, {
  seq: function(self){
    return objectSelection(self, Object.keys(self));
  }
}, ICounted, {
  count: function(self){
    return count(Object.keys(self));
  }
}, IShow, {
  show: function(self){
    var xs = toArray(seq(self));
    return "{" + xs.map(function(pair){
      return show(pair[0]) + ": " + show(pair[1]);
    }).join(", ") + "}";
  }
});