import * as _ from "atomic/core";
import * as $ from "atomic/shell";

function send2(self, message){
  send3(self, message, "log");
}

function send3(self, message, address){
  self[address](message);
}

const send = _.overload(null, null, send2, send3);

export default _.does(
  _.specify($.ISend, {send}));
