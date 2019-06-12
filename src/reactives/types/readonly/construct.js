import {does, satisfies, specify, IDeref} from 'atomic/core';

function deref(self){
  return IDeref.deref(self.source);
}

export default function Readonly(source){
  this.source = source;
}

export function readonly(source){
  const obj = new Readonly(source);
  if (satisfies(IDeref, source)) {
    specify(IDeref, {deref}, obj);
  }
  return obj;
}