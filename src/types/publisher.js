export * from "./publisher/construct";
import Publisher from "./publisher/construct";
export default Publisher;
import behave from "./publisher/impl";
behave(Publisher);