import {IBounds} from '../../protocols';
import {recurrence} from "../recurrence/construct";
import {period} from "./construct";
import {map} from "../lazy-seq/concrete";
import {_ as v} from "param.macro";

export function chop(self, step){
  return map(period(v, step), recurrence(IBounds.start(self), IBounds.end(self), step));
}
