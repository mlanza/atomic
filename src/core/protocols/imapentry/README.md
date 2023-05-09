# IMapEntry

Pulls the key and value from a key-value pair.

`key(self)` — return the key
`val(self)` — return the value

If a thing can itself be identified by a unique key it is not unreasonable for it to return that key from `key` and itself from `val`.  An entity, for example, could return its `GUID`.

This practice is employed against types (see [`keying`](./concrete.js)) in order to allow the library to function across frames in environments like CRM Dynamics.  As implemented the keys pulled from the same constructor in different frames will be not only equivalent, but identical.  Normally, accessing the key is unimportant.  This implementation detail was used to make `is` cross-realm compatible.

Implement no default `key` method as it could result in a quiet `is` comparision which should have failed.
