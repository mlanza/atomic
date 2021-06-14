import {apply, comp, specify, updateIn, assoc, get, getIn, deref, doto, partial, overload, noop, identity, reset, each} from "atomic/core";
import * as mut from "atomic/transients";
import {middleware} from "./construct.js";
import {eventDispatcher} from "../event-dispatcher/construct.js";
import {messageProcessor} from "../message-processor/construct.js";
import {messageHandler} from "../message-handler/construct.js";
import {bus} from "../bus/construct.js";
import {events} from "../events/construct.js";
import {subject} from "../subject/construct.js";
import {IMiddleware} from "../../protocols/imiddleware/instance.js";
import {IEventProvider} from "../../protocols/ieventprovider/instance.js";
import {sub} from "../../protocols/isubscribe/concrete.js";
import {dispatch} from "../../protocols/idispatch/concrete.js";

export function handles(handle){
  return doto({},
    specify(IMiddleware, {handle}));
}

function accepts(events, type){
  const raise = partial(IEventProvider.raise, events);
  return handles(function(_, command, next){
    raise(assoc(command, "type", type));
    next(command);
  });
}

function raises(events, bus, callback){
  const raise = partial(IEventProvider.raise, events);
  return handles(function(_, command, next){
    callback(bus, command, next, raise);
  });
}

function affects3(bus, f, react){
  return handles(function(_, event, next){
    const past = deref(bus),
          present = event.path ? apply(updateIn, past, event.path, f, event.args) : apply(f, past, event.args),
          scope = event.path ? getIn(?, event.path) : identity;
    reset(bus, present);
    react(bus, event, scope(present), scope(past));
    next(event);
  })
}

function affects2(bus, f){
  return affects3(bus, f, noop);
}

export const affects = overload(null, null, affects2, affects3);

function component2(state, callback){
  const evts = events(),
        ware = middleware(),
        observer = subject();
  return doto(bus(state, ware), function($bus){
    const maps = callback(partial(accepts, evts), partial(raises, evts, $bus), partial(affects, $bus));
    const commandMap = maps[0], eventMap = maps[1];
    mut.conj(ware,
      messageHandler(commandMap),
      eventDispatcher(evts, messageHandler(eventMap), observer));
  });
}

function component1(state){
  return component2(state, function(){
    return [{}, {}]; //static components may lack commands that drive state change.
  });
}

export const component = overload(null, component1, component2);