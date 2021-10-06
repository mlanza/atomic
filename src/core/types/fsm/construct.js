import Symbol from "symbol";

export function FiniteStateMachine(state, transitions){
  this.state = state;
  this.transitions = transitions;
}

FiniteStateMachine.prototype[Symbol.toStringTag] = "FiniteStateMachine";

export function fsm(state, transitions){
  return new FiniteStateMachine(state, transitions);
}
