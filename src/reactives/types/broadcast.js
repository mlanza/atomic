export * from "./broadcast/construct";
import Broadcast from "./broadcast/construct";
export default Broadcast;
import behave from "./broadcast/behave";
behave(Broadcast);
export {Broadcast};