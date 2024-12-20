# Abstraction Thinking

Some languages support polymorphism via abstract data types or discriminated unions.  You define various subtypes which fall under an abstraction.  Then functions can be defined which handle all known subtypes.

```fs
type Shape =
    | Rectangle of width : float * length : float
    | Circle of radius : float
    | Prism of width : float * float * height : float

let getShapeWidth shape =
    match shape with
    | Rectangle(width = w) -> w
    | Circle(radius = r) -> 2. * r
    | Prism(width = w) -> w
```

Here `Shape` is the abstraction.  `Rectangle`, `Circle` and `Prism` are its concrete types.

The discriminated unions found in F# are statically checked, not dynamically.  The subtypes and respective behaviors (functions) must be defined up front by the original developer.  Protocols can handle polymorphism just as well, but can also be adapted at runtime by a party who wants to extend the abstraction.

To make [illegal states unrepresentable](https://enterprisecraftsmanship.com/posts/c-and-f-approaches-to-illegal-state/), sometimes discriminated unions are used in state machines to represent different states of some entity.

This was plucked [from here](https://fsharpforfunandprofit.com/posts/designing-with-types-representing-states/):
```fs
type ActiveCartData = { UnpaidItems: string list }
type PaidCartData = { PaidItems: string list; Payment: float }

type ShoppingCart =
    | EmptyCart  // no data
    | ActiveCart of ActiveCartData
    | PaidCart of PaidCartData
```

Where above the 3 concrete types fell under the abstraction `Shape`.  The 3 concrete types here fall under the abstraction `Cart`.  In the former, you had 3 kinds of shapes.  In the latter, you have 3 different forms of an entity.  Protocols, like discriminated unions, are aptly equipped to handle both scenarios.

Create types for each feasible state:

```js
function EmptyCart(){
}

const emptyCart = new EmptyCart();

function ActiveCart(unpaidItems){
  this.unpaidItems = unpaidItems;
}

function PaidCart(paidItems, payment){
  this.paidItems = paidItems;
  this.payment = payment;
}

const $cart = $.atom(emptyCart);
```

Use [persistent commands](./command-query-protocols.md) to swap a subject of one type for another.

```js
function paid(payment){
  return function(activeCart){
    const paidItems = getUnpaidItems(activeCart);
    return new PaidCart(paidItems, payment);
  }
}

try {
  //side-effecting procedure and then...

  const payment = await requestCredit(digits, expDate, secCode, zipCode, amount);

  $.swap($cart, paid(payment));
} catch (ex) {
  //handle failed request
}
```
The key distinction is the `$cart` can be any of an `EmptyCart`, an `ActiveCart` or a `PaidCart` depending on where the customer is in the checkout process.  Certain protocols might need to be implemented against all 3 concrete types to provide a polymorphic, universal api.  And certain actions may only make sense against a given type.  For example, `paid` must only be implemented for an `ActiveCart`.

Protocols won't admittedly get you static type checking, but that's always been a trade off of dynamically-typed scripting languages.  They can still be used in state machines in a manner which makes illegal states unrepresentable.  That is, they can serve to achieve the same purposes.  Additionally, they can be dynamically extended to operate against additional types or to add operations to its api.

Here's the important understanding.  The 3 concrete types together represent a single abstract type (e.g., `Cart`).  From the program's perspective, `$cart` is a `Cart` apart from whichever concrete type it might presently be.  You always anticipate it may be any of the 3.

That's what's meant by abstraction thinking.  You're thinking about the collective set of functions available to the union of the types under the abstraction.  You program in such a way that things are permitted to progress, preferrably without checking what concrete type you have.  Rather, you use the common api (e.g., known protocol(s)) to act or to assess what actions are permissible.

Notice how swapping `$cart` with `paid`, as state machines do, transformed an `ActiveCart` into a `PaidCart`.  Certain actions not only change the entity's inner data, but potentially also its type.  Understanding this, you the programmer are relegated to thinking about the contracted api, not whatever its present concrete type happens to be.

Atomic, for example, has certain persistent operations which replace an `Array` with a an `IndexedSeq`.
