import {isIdentical} from '../core';
import {protocol} from '../protocol';
export const Equiv = protocol({equiv: isIdentical});
export const equiv = Equiv.equiv;
export default Equiv;