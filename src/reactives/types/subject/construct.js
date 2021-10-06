import * as _ from "atomic/core";
import * as mut from "atomic/transients";
import Symbol from "symbol";

export function Subject(observers, terminated){
  this.observers = observers;
  this.terminated = terminated;
}

Subject.prototype[Symbol.toStringTag] = "Subject";

export function subject(observers){
  return new Subject(mut.transient(observers || []), null);
}

export const broadcast = _.called(subject, "`broadcast` deprecated - use `subject` instead.");
