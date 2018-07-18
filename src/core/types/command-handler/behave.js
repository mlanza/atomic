import {effect, overload, constantly, identity, partial} from '../../core';
import {implement} from '../protocol';
import {IMiddleware} from '../../protocols';
import {raise} from "../../protocols/ieventprovider/concrete";
import {config} from "../../protocols/iconfigured/concrete";

function handle(self, command, next){
  self.handle(self.state, command, next, partial(raise, self.events), config(self.state));
}

export default effect(
  implement(IMiddleware, {handle}));