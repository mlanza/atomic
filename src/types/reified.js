import {extend} from '../protocol';

export function reify(protocol, template){
  return extend.apply(this, [new Reified()].concat(slice(arguments)));
}

export function Reified(){
  this.map = new Map();
}

export default Reified;