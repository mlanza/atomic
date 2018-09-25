import {protocol} from "cloe/core";
export const IEventProvider = protocol({
  raise: null,
  release: null
});
export default IEventProvider;