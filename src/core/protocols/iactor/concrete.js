import {IActor} from "./instance.js";
import {IAppendable} from "../iappendable/instance.js";
import {IFunctor} from "../ifunctor/instance.js";
import {overload} from "../../core.js";

export const act = IActor.act;
export const glance = IActor.glance;
export const drain = IActor.drain;
export const events = IActor.events;
export const undone = IActor.undone;

//Type must implement IFunctor (transforming inner state) and IAppendable (adding events)
function actuate3(self, event, f){
  const undoable = IActor.undone(self, event);
  return IFunctor.fmap(IAppendable.append(self, {...event, undoable}), f);
}

export const actuate = overload(null, IActor.actuate, IActor.actuate, actuate3);
