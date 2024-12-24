# Adopting The Clojure Mindset

There is a distinction between [simulating and actuating](./simulating-actuating.md) whose understanding is foundational to the functional paradigm.  In Atomic one keeps state in an atom and [`swaps`](https://clojuredocs.org/clojure.core/swap!) updates against it using simulated commands to models effects.

When one realizes how any mutable operation can be [first simulated](./start-with-simulation.md) he discovers he can fit any domain inside an atom.  To do so he must model a data structure to represent the domain information and write the reductive operations as simulated commands to manipulate it.  This, in turn, further reveals how all programs are, at their very centers, [reductions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce).

That is, every user story is told by an atom seeded with an initial value and reduced one operation after another, by a potentially indefinite series of simulated commands swapped against it.  The result of simulating (in the atom) before actuating (reflecting change in the environment, data stores and/or interface) is a program doing essentially the same things but with another layer.

Still, it would be short sighted to conclude the extra layer only serves to add complexity.  It almost always pays for itself.  It provides a useful boundary between where effects are actuated and its more important logical domain, making it far easier to understand, test and maintain the latter.  It's the compelling motivation for learning to tease the pure out of the impure.

This cornerstone for how Clojure models state change is what Atomic adopted.  Although Atomic offers some persistents which compare to Clojure's, plain objects and arrays are usually preferred.  They're cheap, convenient, and sufficiently performant for most situations.

