export function MessageBus(middlewares){
  this.middlewares = middlewares;
}

export function messageBus(middlewares){
  return new MessageBus(middlewares || []);
}
