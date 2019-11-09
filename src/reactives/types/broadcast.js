export * from "./broadcast/construct";
import {Broadcast} from "./broadcast/construct";
import {behaveAsBroadcast} from "./broadcast/behave";
behaveAsBroadcast(Broadcast);