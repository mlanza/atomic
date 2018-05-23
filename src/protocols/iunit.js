import {protocol, satisfies} from "../types/protocol";
export const IUnit = protocol({
  unit: null
});
export const unit = IUnit.unit;
export const isUnit = satisfies(IUnit);
export default IUnit;