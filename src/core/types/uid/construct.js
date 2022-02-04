import {overload} from "../../core.js";

export function UID(id){
  this.id = id;
}

UID.prototype[Symbol.toStringTag] = "UID";
UID.prototype.toString = function(){
  return this.id;
}

function uid0() {
  const head = (Math.random() * 46656) | 0,
        tail = (Math.random() * 46656) | 0;
  return uid1(("000" + head.toString(36)).slice(-3) + ("000" + tail.toString(36)).slice(-3));
}

function uid1(id){
  return new UID(id);
}

export const uid = overload(uid0, uid1);
