export * from "./audience-detector/construct";
import {AudienceDetector} from "./audience-detector/construct";
import {behaveAsAudienceDetector} from "./audience-detector/behave";
behaveAsAudienceDetector(AudienceDetector);