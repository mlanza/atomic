import {ITransitionable, IEquiv} from "../../protocols.js";
import {getIn} from "../../protocols/ilookup.js";
import {keys} from "../../protocols/imap.js";
import {maybe} from "../../types/just/construct.js";
import {fsm} from "./construct.js";
import {does} from "../../core.js";
import {implement} from "../protocol.js";
import {keying} from "../../protocols/imapentry/concrete.js";

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

export default does(
  keying("FiniteStateMachine"),
  implement(IEquiv, {equiv}),
  implement(ITransitionable, {state, transition, transitions}));
