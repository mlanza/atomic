# Command-Query Separation

Atomic is [functional first}(./functional-first.md) and so the rule is write operations as functions.  Very closely related is that functions must be either commands or queries.

A **command**[^1] is a function which results in a side effect, a change somewhere to the state of the system.  It actuates intent.  Although exceptions can be sparingly made, ordinarily a command does not return a value.

A **query** is a function which has no side effects.  It takes arguments and responds with a return value.  Where queries are pure, commands are impure.

In the functional core, imperative shell way of thinking, the pure code (queries) are segregated in a core module and the impure code (commands) in a main module.  This separation is useful and make the domain logic, usually primarily constrained to the core, much easier to reason about and test.  It essentially why using the approach is such a pleasure.

The benefit of CQS is that it becomes easy to read code and discern where side effects are or are not happening.  And since all the complexity and perils revolve around this, the value of making it easy to spot where this is happening cannot be overstated.

> 💡**Principle**: Command-query separation is good pratice for writing functions.  Prefer return-nothing to return-something commands.

## Simulating commands

Commands can be simulated.  That is, you can take an ordinarily side-effecting function and write an alternative version which is query.

In the alternate version, the function accepts a subject potentially along with operands and returns a new subject.  That subject can is a near-clone of the original except with the change applied.  A function which is actually a query but which is used to simulate a command is called a **faux command**.  It is commonly used against an atom to simulate change before actualizing it.  It is discussed further under [command-query protocols](./command-query-protocols.md).  The `ICloneable` protocol may prove helpful for writing these.

[^1]: Not to be confused with a command POJO (e.g., an object/message) whose corollary is an event POJO.  Commands and events, in that context, are messages where in this context they're operations.

