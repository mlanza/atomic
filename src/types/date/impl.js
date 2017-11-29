import IShow from '../../protocols/ishow';
import {extendType} from '../../protocol';

extendType(Date, IShow, {
  show: function(self){
    return "\"" + self.toISOString() + "\"";
  }
});