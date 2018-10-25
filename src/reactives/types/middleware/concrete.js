import {apply, comp, specify, conj, updateIn, assoc, get, getIn, deref, doto, partial, overload, noop, identity, reset, each} from "cloe/core";
import {middleware} from "./construct";
import {eventDispatcher} from "../event-dispatcher/construct";
import {messageProcessor} from "../message-processor/construct";
import {messageHandler} from "../message-handler/construct";
import {bus} from "../bus/construct";
import {events} from "../events/construct";
import {publisher} from "../publisher/construct";
import {IMiddleware} from "../../protocols/imiddleware/instance";
import {IEventProvider} from "../../protocols/ieventprovider/instance";
import {sub} from "../../protocols/isubscribe/concrete";
import {dispatch} from "../../protocols/idispatch/concrete";
import {_ as v} from "param.macro";

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
          scope = event.path ? getIn(v, event.path) : identity;
    reset(bus, present);
    react(bus, event, scope(present), scope(past));
    next(event);
  })
}

function affects2(bus, f){
  return affects3(bus, f, noop);
}

export const affects = overload(null, null, affects2, affects3);

function component3(config, state, callback){
  const evts = events(),
        ware = middleware(),
        publ = publisher();
  return doto(bus(config, state, ware), function($bus){
    const maps = callback(partial(accepts, evts), partial(raises, evts, $bus), partial(affects, $bus));
    const commandMap = maps[0], eventMap = maps[1];
    conj(ware,
      messageHandler(commandMap),
      eventDispatcher(evts, messageHandler(eventMap), publ));
    each(sub($bus, v), config.changed);
    each(dispatch($bus, v), config.commands);
  });
}

function component2(config, state){
  return component3(config, state, function(){
    return [{}, {}]; //static components may lack commands that drive state change.
  });
}

export const component = overload(null, null, component2, component3);