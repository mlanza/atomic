import {nthIndexed} from "../../common";
import IIndexed from '../../protocols/iindexed';
import IShow from '../../protocols/ishow';
import {extendType} from '../../protocol';

extendType(String, IIndexed, {
  nth: nthIndexed
}, IShow, {
  show: function(self){
    return "\"" + self + "\"";
  }
});