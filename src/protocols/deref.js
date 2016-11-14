import {protocol} from '../protocol.js';
export const Deref = protocol({
  deref: function(self){
    return self != null && self.valueOf ? self.valueOf() : self;
  }
});
export const deref = Deref.deref;
export default Deref;