export * from "./fsm/construct.js";
import {FiniteStateMachine} from "./fsm/construct.js";
import {behaveAsFiniteStateMachine} from "./fsm/behave.js";
behaveAsFiniteStateMachine(FiniteStateMachine);