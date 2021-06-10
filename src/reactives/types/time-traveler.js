export * from "./time-traveler/construct.js";
import {TimeTraveler} from "./time-traveler/construct.js";
import {behaveAsTimeTraveler} from "./time-traveler/behave.js";
behaveAsTimeTraveler(TimeTraveler);