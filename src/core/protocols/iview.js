import {protocol, satisfies} from "../types/protocol";
export const IView = protocol({
  init: null,
  render: null,
  patch: null,
  commands: null,
  events: null
});
export const isView = satisfies(IView);