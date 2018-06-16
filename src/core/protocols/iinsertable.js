import {protocol, satisfies} from "../types/protocol";
export const IInsertable = protocol({
  before: null,
  after: null
});
export const isInsertable = satisfies(IInsertable);