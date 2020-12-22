import {IStateMachine, IEquiv} from '../../protocols';
import {getIn} from '../../protocols/ilookup';
import {keys} from '../../protocols/imap';
import {maybe} from '../../types/maybe/construct';
import {fsm} from "./construct";
import {does} from '../../core';
import {implement} from '../protocol';

function equiv(self, other){
  return state(self) === state(other) && self.transitions === other.transitions;
}

function state(self){
  return self.state;
}

function transitions(self){
  return keys(self.transitions[self.state]);
}

function transition(self, event) {
  return maybe(self.transitions, getIn(?, [self.state, event]), fsm(?, self.transitions)) || self;
}

export const behaveAsFiniteStateMachine = does(
  implement(IEquiv, {equiv}),
  implement(IStateMachine, {state, transition, transitions}));