import {push} from "../../protocols/ipush/concrete";
import {doto, partial, overload} from '../../core';
import {middleware} from './construct';
import {eventDispatcher} from '../event-dispatcher';
import {messageHandler} from '../message-handler';
import {messageProcessor} from '../message-processor';
import {bus} from "../bus/construct";
import {events} from "../events/construct";
import {publisher} from "../publisher/construct";
import {apply} from "../function/concrete";
import {specify, reifiable} from "../protocol/concrete";
import {ISwap, ILookup, IMiddleware, IDeref, IAssociative, IEventProvider} from "../../protocols";

export function handles(handle){
  return doto({},
    specify(IMiddleware, {handle}));
}

function accepts(events, type){
  const raise = partial(IEventProvider.raise, events);
  return handles(function(_, command, next){
    raise(IAssociative.assoc(command, "type", type));
    next(command);
  });
}

function raises(events, bus, callback){
  const raise = partial(IEventProvider.raise, events);
  return handles(function(_, command, next){
    callback(bus, command, next, raise);
  });
}

export function affects(bus, f, react){
  return handles(function(_, event, next){
    const past = IDeref.deref(bus);
    ISwap.swap(bus, function(memo){
      return apply(f, memo, ILookup.lookup(event, "args"));
    });
    const present = IDeref.deref(bus);
    react && react(bus, event, present, past);
    next(event);
  })
}

export function component(config, state, callback){
  const evts = events(),
        ware = middleware(),
        publ = publisher();
  return doto(bus(config, state, ware), function(bus){
    const [commandMap, eventMap] = callback(partial(accepts, evts), partial(raises, evts, bus), partial(affects, bus));
    push(ware,
      messageHandler(commandMap),
      eventDispatcher(evts, messageHandler(eventMap), publ));
  });
}