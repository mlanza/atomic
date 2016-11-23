import {pipe} from '../core';
import {protocol} from '../protocol';
import Seqable from './seqable';
import Seq from './seq';
export const Next = protocol({next: pipe(Seq.rest, Seqable.seq)});
export default Next;