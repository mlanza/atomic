import {protocol} from '../protocol.js';
export const Deref = protocol({
  deref: function(self){
    return self.valueOf();
  }
});
export const deref = Deref.deref;
export default Deref;