import * as _ from "atomic/core";
import * as mut from "atomic/transients";

export function Subject(observers, terminated){
  this.observers = observers;
  this.terminated = terminated;
}

export function subject(observers){
  return new Subject(mut.transient(observers || []), null);
}

export const broadcast = _.called(subject, "`broadcast` deprecated - use `subject` instead.");
