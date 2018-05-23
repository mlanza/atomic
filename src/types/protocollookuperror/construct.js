export function ProtocolLookupError(protocol, named, subject, args) {
  this.protocol = protocol;
  this.named = named;
  this.subject = subject;
  this.args = args;
}

ProtocolLookupError.prototype = new Error();
ProtocolLookupError.prototype.toString = function(){
  return "Protocol lookup for " + this.named + " failed.";
}

export function protocolLookupError(...args){
  return new ProtocolLookupError(...args);
}

export default ProtocolLookupError;