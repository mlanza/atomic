# IInclusive

Represents a collection which can determine if it includes some item.

* `includes(self, item)` - Does the collection include the item?
* `includes(self, ...items)` - Does the collection include all the items?

Having implemented `includes` the following operations are derived:

* `excludes(self, item)` - Does the collection exclude the item?
* `excludes(self, ...items)` - Does the collection exclude all the items?

Native JavaScript objects can be thought of as key/value collections, thus:

```js
const moe = {fname: "Moe", lname: "Howard", occupation: "Comedian"};
moe |> and(contains(?, "lname", "Howard"), contains(?, "fname", "Moe"));
includes(moe, ["lname", "Howard"], ["fname", "Moe"]);
```

* `exclude(coll, item)` - Removes the all copies of an item from the collection.
* `exclude(coll, ...items)` - Removes the all copies of the listed items from the collection.
* `include(coll, item)` - Adds an item not already present.
* `include(coll, ...items)` - Adds items not already present.

See also `contains`.
