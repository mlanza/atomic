import {protocol} from '../protocol';
import {conj as _conj} from '../types/list';
export const Collection = protocol({conj: _conj, cons: _conj});
export default Collection;