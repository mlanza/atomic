import ObjectSelection, {objectSelection} from '../../types/objectselection/construct';
import IndexedSeq, {indexedSeq} from '../../types/indexedseq/construct';
import ICollection from '../../protocols/icollection';
import INext from '../../protocols/inext';
import ISeq from '../../protocols/iseq';
import ISeqable from '../../protocols/iseqable';
import IIndexed from '../../protocols/iindexed';
import IShow from '../../protocols/ishow';
import ICounted from '../../protocols/icounted';
import ILookup from '../../protocols/ilookup';
import IFn from '../../protocols/ifn';
import IMap from '../../protocols/imap';
import IEmptyableCollection from '../../protocols/iemptyablecollection';
import {show} from '../../protocols/ishow';
import {first, rest, toArray} from '../../protocols/iseq';
import {seq} from '../../protocols/iseqable';
import {identity, constantly, EMPTY_OBJECT} from '../../core';
import {lazySeq} from '../../types/lazyseq/construct';
import {toArraySeq} from "../../common";
import {extendType} from '../../protocol';

function lookup(self, key){
  return self.keys.indexOf(key) > -1 ? self.obj[key] : null;
}

extendType(ObjectSelection, IMap, {
  _dissoc: function(self, key){
    var keys = toArray(self.keys).filter(function(k){
      return k !== key;
    });
    return objectSelection(self,  keys);
  }
}, ISeq, {
  first: function(self){
    var key = first(self.keys);
    return [key, self.obj[key]];
  },
  rest: function(self){
    return objectSelection(self.obj, rest(self.keys));
  },
  toArray: toArraySeq
}, IEmptyableCollection, {
  empty: constantly(EMPTY_OBJECT)
}, IFn, {
  invoke: lookup
}, ILookup, {
  lookup: lookup
}, ISeqable, {
  seq: function(self){
    var key = first(self.keys);
    return lazySeq([key, self.obj[key]], function(){
      return objectSelection(self.obj, rest(self.keys));
    });
  }
}, ICounted, {
  count: function(self){
    return self.keys.length;
  }
}, IShow, {
  show: function(self){
    var pairs = toArray(seq(self));
    return "#object-selection {" + pairs.map(function(pair){
      return show(pair[0]) + ": " + show(pair[1]);
    }).join(", ") + "}";
  }
});