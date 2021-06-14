export function Subject(observers, terminated){
  this.observers = observers;
  this.terminated = terminated;
}

export function subject(observers){
  return new Subject(observers || [], null);
}

export const broadcast = subject;