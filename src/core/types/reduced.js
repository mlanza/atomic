export * from "./reduced/construct";
export * from "./reduced/concrete";
import {Reduced} from "./reduced/construct";
import {behaveAsReduced} from "./reduced/behave";
behaveAsReduced(Reduced);
