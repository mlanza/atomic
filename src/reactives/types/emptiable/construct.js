export class Emptiable {
  constructor(callback, coll){
    this.callback = callback;
    this.coll = coll;
  }

  monitor(f){
    const was = this.emptied();
    f.call(this);
    const curr = this.emptied();
    if (was !== curr){
      this.callback(curr);
    }
  }

  push(...args){
    this.monitor(function(){
      this.coll.push(...args);
    });
  }

  slice(...args){
    return new this.constructor(this.callback, this.coll.slice(...args));
  }

  splice(...args){
    if (arguments.length) {
      this.monitor(function(){
        this.coll.splice(...args);
      });
    }
    return this;
  }

  indexOf(...args){
    return this.coll.indexOf(...args);
  }

  lastIndexOf(...args){
    return this.coll.lastIndexOf(...args);
  }

  emptied(){
    return this.coll.length === 0;
  }

  get length(){
    return this.coll.length;
  }
}

export function emptiable(callback, coll){
  const obj = new Emptiable(callback, coll || []);
  callback(obj.emptied());
  return obj;
}