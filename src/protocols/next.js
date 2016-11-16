import {protocol} from '../protocol.js';
export const Next = protocol({next: null});
export const next = Next.next;
export default Next;