import * as _ from "atomic/core";

export function Subject(observers, terminated){
  this.observers = observers;
  this.terminated = terminated;
}

Subject.prototype[Symbol.toStringTag] = "Subject";

export function subject(observers){
  return new Subject(observers || [], null);
}
