import protocol from '../protocol.js';

const Deref = protocol({
  deref: function(obj){
    return obj.valueOf();
  }
});

export default Deref;
export const deref = Deref.deref;
