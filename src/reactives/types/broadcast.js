export * from "./broadcast/construct.js";
import {Broadcast} from "./broadcast/construct.js";
import {behaveAsBroadcast} from "./broadcast/behave.js";
behaveAsBroadcast(Broadcast);