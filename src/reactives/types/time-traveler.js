export * from "./time-traveler/construct";
import {TimeTraveler} from "./time-traveler/construct";
import {behaveAsTimeTraveler} from "./time-traveler/behave";
behaveAsTimeTraveler(TimeTraveler);