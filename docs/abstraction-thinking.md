# Abstraction Thinking

F# supports polymorphism via discriminated unions.  With this approach, you define the subtypes which fall under an abstraction.  Then polymorphic functions can be defined to handle all known subtypes.

Here `Shape` is the abstraction and  `Rectangle`, `Circle` and `Prism` its concrete types:

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

The benefit of the discriminated unions found in F# is the programs are statically checked at compile time.  The subtypes and respective behaviors (functions) are defined up front by the developer.

They can also be used to represent different states of some entity.  Think "states" as in the different states, or stages, of the state machine representing that entity.

This was plucked [from here](https://fsharpforfunandprofit.com/posts/designing-with-types-representing-states/):
```fs
type ActiveCartData = { UnpaidItems: string list }
type PaidCartData = { PaidItems: string list; Payment: float }

type ShoppingCart =
    | EmptyCart  // no data
    | ActiveCart of ActiveCartData
    | PaidCart of PaidCartData
```

The 3 concrete types here fall under the abstraction `ShoppingCart`.  Where the former example offers an umbrella category, `Shape`, and the 3 disparate types the program is aware of, the latter example offers a single concept, `ShoppingCart`, in 3 different forms.

Protocols, being just another approach to polymorphism, can well handle both scenarios.  Furthermore, because JavaScript is a dynamic language, they can be adapted at runtime by anyone who wants to extend the abstraction.  This may be the original developer or a third-party developer.

Let's handle the more complicated state machine scenario by defining its concrete types:

```js
function EmptyCart(){
}

function ActiveCart(unpaidItems){
  this.unpaidItems = unpaidItems;
}

function PaidCart(paidItems, payment){
  this.paidItems = paidItems;
  this.payment = payment;
}

const emptyCart = new EmptyCart();
```

Seed the atom with an initial state:
```js
const $cart = $.atom(emptyCart);
```

Provide a [faux command](simulating-actuating.md) for transitioning the state:

```js
function paid(payment){
  return function(activeCart){
    const paidItems = getUnpaidItems(activeCart);
    return new PaidCart(paidItems, payment);
  }
}
```

Then, at an opportune time, presuming right after the customer initiates checkout and the `amount` computed:

```js
try {
  const payment = await requestCredit(digits, expDate, secCode, zipCode, amount);
  $.swap($cart, paid(payment));
} catch (ex) {
  //handle failed request
}
```

The abstract `ShoppingCart` can be any of an `EmptyCart`, an `ActiveCart` or a `PaidCart` depending on where the customer is in the checkout process.  Certain protocols may need to be implemented against all 3 concrete types to provide a polymorphic, universal api.  And certain actions may only make sense against a given type.  For example, `paid` exists only for an `ActiveCart`.

The crux of abstraction thinking is `$cart` is a `ShoppingCart` is an abstract data type.  You are, therefore, relegated to think about its behaviors via a contracted api, not what its present concrete type happens to be or what it may become.  You bear in mind the [functions](./functions-first.md) which are available for acting against it and for assessing what's logically possible, preferrably without ever checking its concrete type.

Notice how swapping `$cart` with `paid` transitions an `ActiveCart` into a `PaidCart`.  Certain actions may not only change the state of an entity's data, but, where state machines are concerned, potentially also transition its type.  Thus, protocols are no less apt, with a bit of design forethought, for [making illegal states unrepresentable](https://enterprisecraftsmanship.com/posts/c-and-f-approaches-to-illegal-state/).
