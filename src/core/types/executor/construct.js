import {overload} from '../../core';

export default function Executor(execute, react, state, bus){
  this.execute = execute;
  this.react = react;
  this.state = state;
  this.bus = bus;
}

function executor3(execute, state, bus){
  return executor4(execute, null, state, bus);
}

function executor4(execute, react, state, bus){
  return new Executor(execute, react, state, bus);
}

export const executor = overload(null, null, null, executor3, executor4);