import {protocol, satisfies} from "../types/protocol";
export const IUnit = protocol({
  unit: null
});
export const isUnit = satisfies(IUnit);