import {push} from "../../protocols/ipush/concrete";
import {_ as v} from "param.macro";
import {doto, partial, overload, intercept} from '../../core';
import {eventDispatcher} from '../event-dispatcher';
import {messageHandler} from '../message-handler';
import {messageProcessor} from '../message-processor';
import {bus} from "../bus/construct";
import {events} from "../events/construct";
import {publisher} from "../publisher/construct";
import {apply} from "../function/concrete";
import {specify} from "../protocol/concrete";
import {ISwap, ILookup, IMiddleware, IDeref, IAssociative, IEventProvider} from "../../protocols";

export default function Middleware(handlers){
  this.handlers = handlers;
}

export function middleware(handlers){
  return doto(new Middleware(handlers || []),
    apply(push, v, handlers));
}

export function handles(handle){
  return doto({},
    specify(IMiddleware, {handle}));
}

export function affects(bus, f, react){
  return handles(function(_, event, next){
    const past = IDeref.deref(bus);
    ISwap.swap(bus, function(memo){
      return apply(f, memo, ILookup.lookup(event, "args"));
    });
    const present = IDeref.deref(bus);
    react && react(event, bus, present, past);
    next(event);
  })
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

export const raising = intercept(raises, function(_, key){
  return typeof key === "string";
}, accepts);

export function component(config, state, callback){
  const evts = events(),
        ware = middleware(),
        publ = publisher();
  return doto(bus(config, state, ware), function(bus){
    const raise = partial(raising, evts),
          affect = partial(affects, bus),
          [commandMap, eventMap] = callback(raise, affect, evts, publ);
    push(ware,
      messageHandler(commandMap),
      eventDispatcher(evts, messageHandler(eventMap), publ));
  });
}