import * as _ from "atomic/core";
import * as mut from "atomic/transients";
import * as p from "../../protocols/concrete.js";
import {middleware} from "./construct.js";
import {eventDispatcher} from "../event-dispatcher/construct.js";
import {messageProcessor} from "../message-processor/construct.js";
import {messageHandler} from "../message-handler/construct.js";
import {bus} from "../bus/construct.js";
import {events} from "../events/construct.js";
import {subject} from "../subject/construct.js";
import {IMiddleware} from "../../protocols/imiddleware/instance.js";

function handles(handle){
  return _.doto({},
    _.specify(IMiddleware, {handle}));
}

function accepts(events, type){
  const raise = _.partial(p.raise, events);
  return handles(function(x, command, next){
    raise(_.assoc(command, "type", type));
    next(command);
  });
}

function raises(events, bus, callback){
  const raise = _.partial(p.raise, events);
  return handles(function(x, command, next){
    callback(bus, command, next, raise);
  });
}

function affects3(bus, f, react){
  return handles(function(x, event, next){
    const past = _.deref(bus),
          present = event.path ? _.apply(_.updateIn, past, event.path, f, event.args) : _.apply(f, past, event.args),
          scope = event.path ? _.getIn(?, event.path) : _.identity;
    _.reset(bus, present);
    react(bus, event, scope(present), scope(past));
    next(event);
  })
}

function affects2(bus, f){
  return affects3(bus, f, _.noop);
}

export const affects = _.overload(null, null, affects2, affects3);

function component2(state, callback){
  const evts = events(),
        ware = middleware(),
        observer = subject();
  return _.doto(bus(state, ware), function($bus){
    const maps = callback(_.partial(accepts, evts), _.partial(raises, evts, $bus), _.partial(affects, $bus));
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

export const component = _.overload(null, component1, component2);
