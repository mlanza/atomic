import IIndexed from '../../protocols/iindexed';
import ISeq from '../../protocols/iseq';
import IShow from '../../protocols/ishow';
import ICounted from '../../protocols/icounted';
import {nthIndexed} from "../../common";
import {extendType} from '../../protocol';

extendType(String, IIndexed, {
  nth: nthIndexed
}, ISeq, {
  first: function(self){
    return self[0] || null;
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