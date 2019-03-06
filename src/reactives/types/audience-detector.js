export * from "./audience-detector/construct";
import AudienceDetector from "./audience-detector/construct";
export default AudienceDetector;
import behave from "./audience-detector/behave";
behave(AudienceDetector);