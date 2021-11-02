import * as _ from "atomic/core";
import Symbol from "symbol";

export function Subject(observers, terminated){
  this.observers = observers;
  this.terminated = terminated;
}

Subject.prototype[Symbol.toStringTag] = "Subject";

export function subject(observers){
  return new Subject(_.volatile(observers || []), null);
}

export const broadcast = _.called(subject, "`broadcast` deprecated - use `subject` instead.");
