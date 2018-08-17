export default function FiniteStateMachine(state, transitions){
  this.state = state;
  this.transitions = transitions;
}

export function fsm(state, transitions){
  return new FiniteStateMachine(state, transitions);
}