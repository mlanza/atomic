import Symbol from "symbol";

export function MessageHandler(handlers, fallback){
  this.handlers = handlers;
  this.fallback = fallback;
}

MessageHandler.prototype[Symbol.toStringTag] = "MessageHandler";

export function messageHandler(handlers, fallback){
  return new MessageHandler(handlers, fallback);
}
