export default function Executor(state, execute){
  this.state = state;
  this.execute = execute;
}

export function executor(state, execute){
  return new Executor(state, execute);
}