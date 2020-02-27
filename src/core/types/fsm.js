export * from "./fsm/construct";
import {FiniteStateMachine} from "./fsm/construct";
import {behaveAsFiniteStateMachine} from "./fsm/behave";
behaveAsFiniteStateMachine(FiniteStateMachine);