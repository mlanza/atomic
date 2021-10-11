# IInclusive

Represents a collection which can determine if it includes some item.

* `includes(self, item)` - Does the collection include the item?
* `includes(self, ...items)` - Does the collection include all the items?

Having implemented `includes` the following operations are derived:

* `excludes(self, item)` - Does the collection exclude the item?
* `excludes(self, ...items)` - Does the collection exclude all the items?

Native JavaScript objects can be thought of as key/value collections, thus:

```
const moe = {fname: "Moe", lname: "Howard", occupation: "Comedian"};
moe |> and(contains(?, "lname", "Howard"), contains(?, "fname", "Moe"));
includes(moe, ["lname", "Howard"], ["fname", "Moe"]);
```