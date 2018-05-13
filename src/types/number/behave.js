import {effect, overload} from '../../core';
import {implement} from '../../protocol';
import {IOffset, IShow} from '../../protocols';

function inc1(self){
  return self + 1;
}

function inc2(self, amount){
  return self + amount;
}

function dec1(self){
  return self - 1;
}

function dec2(self, amount){
  return self - amount;
}

function show(n){
  return n.toString();
}

const inc = overload(null, inc1, inc2);
const dec = overload(null, dec1, dec2);

export default effect(
  implement(IOffset, {inc: inc, dec: dec}),
  implement(IShow, {show: show}));