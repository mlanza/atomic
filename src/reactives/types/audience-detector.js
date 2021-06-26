export * from "./audience-detector/construct.js";
import {AudienceDetector} from "./audience-detector/construct.js";
import behave from "./audience-detector/behave.js";
behave(AudienceDetector);