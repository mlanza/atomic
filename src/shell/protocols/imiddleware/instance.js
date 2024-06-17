import {protocol} from "atomic/core";
export const IMiddleware = protocol({
  handle: null,
  addMiddleware: null,
  addHandler: null
});
