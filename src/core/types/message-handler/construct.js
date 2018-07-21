export default function MessageHandler(handlers, fallback){
  this.handlers = handlers;
  this.fallback = fallback;
}

export function messageHandler(handlers, fallback){
  return new MessageHandler(handlers, fallback);
}