export default function Actuator(state, effects){
  this.state = state;
  this.effects = effects;
}

export function actuator(state, effects){
  return new Actuator(state, effects);
}