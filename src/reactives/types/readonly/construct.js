import {does, satisfies, specify, called, IDeref} from "atomic/core";

function deref(self){
  return IDeref.deref(self.source);
}

export function Readonly(source){
  this.source = source;
}

export const readonly = called(function readonly(source){
  const obj = new Readonly(source);
  if (satisfies(IDeref, source)) {
    specify(IDeref, {deref}, obj);
  }
  return obj;
}, "`readonly` is deprecated — use `Observable.from` instead.");