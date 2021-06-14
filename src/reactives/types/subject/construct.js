import {called} from "atomic/core";
import {transient} from "atomic/transients";

export function Subject(observers, terminated){
  this.observers = observers;
  this.terminated = terminated;
}

export function subject(observers){
  return new Subject(transient(observers || []), null);
}

export const broadcast = called(subject, "`broadcast` deprecated - use `subject` instead.");