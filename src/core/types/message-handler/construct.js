import {overload} from '../../core';
import {reducekv} from "../../protocols/ikvreduce/concrete";
import {assoc} from "../../protocols/iassociative/concrete";
import {apply} from "../../types/function/concrete";

export default function MessageHandler(handlers, fallback){
  this.handlers = handlers;
  this.fallback = fallback;
}

function messageHandler3(handlers, fallback, deps){
  return new MessageHandler(reducekv(function(memo, key, value){
    return assoc(memo, key, apply(value, deps));
  }, {}, handlers), fallback == null ? null : apply(fallback, deps));
}

function messageHandler2(handlers, deps){
  return messageHandler3(handlers, null, deps);
}

export const messageHandler = overload(null, null, messageHandler2, messageHandler3);