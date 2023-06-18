import {does, identity} from "../../core.js";
import {implement} from "../protocol.js";
import {ICloneable, IHashable, IBounded, IAddable, IInversive, IComparable, IMultipliable, IDivisible} from "../../protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";

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

const clone = identity,
      start = identity,
      end   = identity,
      hash  = identity;

export default does(
  keying("Number"),
  implement(ICloneable, {clone}),
  implement(IHashable, {hash}),
  implement(IDivisible, {divide}),
  implement(IMultipliable, {mult}),
  implement(IBounded, {start, end}),
  implement(IComparable, {compare}),
  implement(IInversive, {inverse}),
  implement(IAddable, {add}));
