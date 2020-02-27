export function ProtocolLookupError(protocol, method, subject, args) {
  this.protocol = protocol;
  this.method = method;
  this.subject = subject;
  this.args = args;
}

ProtocolLookupError.prototype = new Error();
ProtocolLookupError.prototype.toString = function(){
  return "Protocol lookup for " + this.method + " failed.";
}

export function protocolLookupError(...args){
  return new ProtocolLookupError(...args);
}