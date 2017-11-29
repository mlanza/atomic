import Reduced from '../../types/reduced/construct';
import IDeref from '../../protocols/ideref';
import {extendType} from '../../protocol';

export default extendType(Reduced, IDeref, {
  deref: function(self){
    return self.valueOf();
  }
});