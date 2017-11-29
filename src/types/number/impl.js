import IShow from '../../protocols/ishow';
import {extendType} from '../../protocol';

extendType(Number, IShow, {
  show: function(self){
    return self.toString();
  }
});