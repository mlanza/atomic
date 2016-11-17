import {protocol} from '../protocol';
export const Deref = protocol({
  deref: function(self){
    return self.valueOf();
  }
});
export const deref = Deref.deref;
export default Deref;