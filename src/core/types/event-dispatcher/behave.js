import {IMiddleware} from '../../protocols';
import {does, partial} from '../../core';
import {implement} from '../protocol';
import {handle as _handle} from '../../protocols/imiddleware/concrete';
import {pub} from '../../protocols/ipublish/concrete';
import {release} from '../../protocols/ieventprovider/concrete';
import {each} from '../lazy-seq/concrete';

function handle(self, command, next){
  next(command);
  each(function(event){
    _handle(self.bus, event);
    pub(self.publisher, event);
  }, release(self.events));
}

export default does(
  implement(IMiddleware, {handle}));