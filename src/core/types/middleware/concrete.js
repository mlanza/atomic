import {conj} from "../../protocols/icollection/concrete";
import {updateIn, assoc} from "../../protocols/iassociative/concrete";
import {get, getIn} from "../../protocols/ilookup/concrete";
import {deref} from "../../protocols/ideref/concrete";
import {doto, partial, overload, noop, identity} from '../../core';
import {middleware} from './construct';
import {eventDispatcher} from '../event-dispatcher';
import {messageHandler} from '../message-handler';
import {messageProcessor} from '../message-processor';
import {bus} from "../bus/construct";
import {events} from "../events/construct";
import {publisher} from "../publisher/construct";
import {apply, comp} from "../function/concrete";
import {specify, reifiable} from "../protocol/concrete";
import {IReset, ILookup, IMiddleware, IDeref, IAssociative, IEventProvider} from "../../protocols";
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
    IReset.reset(bus, present);
    react(bus, event, scope(present), scope(past));
    next(event);
  })
}

function affects2(bus, f){
  return affects3(bus, f, noop);
}

export const affects = overload(null, null, affects2, affects3);

export function component(config, state, callback){
  const evts = events(),
        ware = middleware(),
        publ = publisher();
  return doto(bus(config, state, ware), function(bus){
    const [commandMap, eventMap] = callback(partial(accepts, evts), partial(raises, evts, bus), partial(affects, bus));
    conj(ware,
      messageHandler(commandMap),
      eventDispatcher(evts, messageHandler(eventMap), publ));
  });
}