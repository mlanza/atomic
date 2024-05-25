import {overload} from "../../core.js";

export function GUID(id){
  this.id = id;
}

GUID.prototype[Symbol.toStringTag] = "GUID";

GUID.prototype.toString = function(){
  return this.id;
}

export function guids(random = Math.random){
  function s4() {
    return Math.floor((1 + random()) * 0x10000).toString(16).substring(1);
  }

  function guid1(id){
   return new GUID(id);
  }

  function guid0(){
    return guid1(s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4());
  }

  return overload(guid0, guid1);
}

export const guid = guids();
