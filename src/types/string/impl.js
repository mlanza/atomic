import IIndexed from '../../protocols/iindexed';
import ISeq from '../../protocols/iseq';
import IShow from '../../protocols/ishow';
import ICounted from '../../protocols/icounted';
import ILookup from '../../protocols/ilookup';
import IFn from '../../protocols/ilookup';
import IEmptyableCollection from '../../protocols/iemptyablecollection';
import {constantly, EMPTY_STRING} from "../../core";
import {nthIndexed} from "../../common";
import {extendType} from '../../protocol';

function lookup(self, key){
  return self[key];
}

export function replace(s, match, replacement){
  return s.replace(match, replacement);
}

extendType(String, IIndexed, {
  nth: nthIndexed
}, IEmptyableCollection, {
  empty: constantly(EMPTY_STRING)
}, IFn, {
  invoke: lookup
}, ILookup, {
  lookup: lookup
}, ISeq, {
  first: function(self){
    return self[0];
  },
  rest: function(self){
    return self.substring(1);
  },
  toArray: function(self){
    return self.split('');
  }
}, ICounted, {
  count: function(self){
    return self.length;
  }
}, IShow, {
  show: function(self){
    return "\"" + self + "\"";
  }
});