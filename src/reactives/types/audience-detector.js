export * from "./audience-detector/construct.js";
import {AudienceDetector} from "./audience-detector/construct.js";
import {behaveAsAudienceDetector} from "./audience-detector/behave.js";
behaveAsAudienceDetector(AudienceDetector);