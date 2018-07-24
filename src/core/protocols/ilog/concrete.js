import ILog from "./instance";
import {overload} from "../../core";
export const log = overload(null, console.log.bind(console), ILog.log);