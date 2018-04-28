import {doto, overload} from '../../core';
import {implement} from '../../protocol';
import IShow from '../../protocols/ishow';
import IOffset from '../../protocols/ioffset';

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

doto(Number,
  implement(IOffset, {inc: inc, dec: dec}),
  implement(IShow, {show: show}));