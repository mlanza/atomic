import {protocol, satisfies} from "../types/protocol";
export const IView = protocol({
  render: null,
  patch: null
});
export const isView = satisfies(IView);