import {does, identity} from "../../core.js";
import {implement} from "../protocol.js";
import {IBounds, IAddable, IInverse, IComparable, IMultipliable, IDivisible} from "../../protocols.js";
import {naming} from "../../protocols/inamable/concrete.js";

function compare(self, other){
  return self === other ? 0 : self - other;
}

function add(self, other){
  return self + other;
}

function inverse(self){
  return self * -1;
}

function mult(self, n){
  return self * n;
}

function divide(self, n){
  return self / n;
}

const start = identity,
      end   = identity;

export default does(
  naming("Number"),
  implement(IDivisible, {divide}),
  implement(IMultipliable, {mult}),
  implement(IBounds, {start, end}),
  implement(IComparable, {compare}),
  implement(IInverse, {inverse}),
  implement(IAddable, {add}));
