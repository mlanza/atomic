import {protocol} from '../protocol';
export const Query = protocol({query: null, fetch: null});
export const query = Query.query;
export const fetch = Query.fetch;
export default Query;