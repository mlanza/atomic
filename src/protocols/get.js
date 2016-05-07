import {extend} from '../protocol.js';
import protocol from '../protocol.js';
import * as dom from '../core/dom.js';

const Get = protocol({
  get: function(self, key){
    return self instanceof HTMLElement ? dom.get(self, key) : self[key];
  }
});

export default Get;
export const get  = Get.get;
