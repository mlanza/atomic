import * as _ from "atomic/core";

function deref(self){
  return _.deref(self.source);
}

export function Readonly(source){
  this.source = source;
}

export const readonly = _.called(function readonly(source){
  const obj = new Readonly(source);
  if (_.satisfies(_.IDeref, source)) {
    _.specify(_.IDeref, {deref}, obj);
  }
  return obj;
}, "`readonly` is deprecated — use `Observable.from` instead.");
