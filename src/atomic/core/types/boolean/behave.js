import {does, identity} from "../../core.js";
import {implement} from "../protocol.js";
import {IHashable, IInversive, IComparable} from "../../protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function compare(self, other){
  return self === other ? 0 : self === true ? 1 : -1;
}

function inverse(self){
  return !self;
}

function hash(self){
  return self ? 1 : 0;
}

export default does(
  keying("Boolean"),
  implement(IHashable, {hash}),
  implement(IComparable, {compare}),
  implement(IInversive, {inverse}));
