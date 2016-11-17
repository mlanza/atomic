
import {flip} from '../core';
import {protocol} from '../protocol';
export const Query = protocol({query: null, fetch: null});
export const query = flip(Query.query,2); //TODO queryTop
export const fetch = flip(Query.fetch,2);
export default Query;