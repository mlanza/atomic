import {protocol, satisfies} from "../types/protocol";
export const IStateful = protocol({
  init: null,
  commands: null,
  events: null
});
export const isStateful = satisfies(IStateful);