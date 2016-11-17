import {protocol} from '../protocol';
export const Deref = protocol({
  deref: function(self){
    return self.valueOf();
  }
});
export default Deref;