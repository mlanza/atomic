# Testing

> What?! No tests!?

Developers may notice what’s missing here for the agent—no unit tests, no test harness, no TDD mandate. That absence is intentional.

Tests are valuable, but they also **petrify ideas**. They harden what’s still fluid. In the early stages of work, I'm exploring—poking, pivoting, learning what the system wants to become. Agents too. During this phase, certainty is scarce and flexibility is everything. Managing another layer of fixtures, mocks, and harnesses only slows discovery. It trades movement for ceremony.

I practice **Tracer Bullet Development**: firing working rounds through the stack to confirm aim, then adjusting. Each bullet teaches more than a hundred assertions written too soon. The REPL and CLI serve as our live feedback loops; they *are* our tests, only conversational and disposable.

Formal tests have their rightful place. They’re **safety nets**—guarantees to customers that shipped software can be trusted to meet its promises. Once the design stabilizes, once the idea is no longer in motion, tests become that covenant of reliability. Until then, they’re ballast.

**No TDD here.** Not because testing is unimportant, but because *freedom to pivot* is. We trade early rigidity for creative velocity, trusting that confidence and correctness will come later—when there’s finally something worth defending.
