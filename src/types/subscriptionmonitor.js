export * from "./subscriptionmonitor/construct";
import SubscriptionMonitor from "./subscriptionmonitor/construct";
export default SubscriptionMonitor;
import behave from "./subscriptionmonitor/behave";
behave(SubscriptionMonitor);