import {specify, ISend, overload, does} from 'atomic/core';

function send2(self, message){
  send3(self, message, "log");
}

function send3(self, message, address){
  self[address](message);
}

const send = overload(null, null, send2, send3);

export default does(
  specify(ISend, {send}));