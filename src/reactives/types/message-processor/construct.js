export function MessageProcessor(action){
  this.action = action;
}

export function messageProcessor(action){
  return new MessageProcessor(action);
}