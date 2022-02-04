export function MessageProcessor(action){
  this.action = action;
}

MessageProcessor.prototype[Symbol.toStringTag] = "MessageProcessor";

export function messageProcessor(action){
  return new MessageProcessor(action);
}
