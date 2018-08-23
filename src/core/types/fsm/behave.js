import {IStateMachine} from '../../protocols';
import {fsm} from "./construct";
import {does} from '../../core';
import {implement} from '../protocol';

function state(self){
  return self.state;
}

function transition(self, state){
  return self.transitions[self.state].indexOf(state) > -1 ? fsm(state, self.transitions) : self;
}

export default does(
  implement(IStateMachine, {state, transition}));