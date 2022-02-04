export function MessageBus(middlewares){
  this.middlewares = middlewares;
}

MessageBus.prototype[Symbol.toStringTag] = "MessageBus";

export function messageBus(middlewares){
  return new MessageBus(middlewares || []);
}
