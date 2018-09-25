import {protocol} from "cloe/core";
export const ISubscribe = protocol({
  sub: null,
  unsub: null,
  subscribed: null
});
export default ISubscribe;