# Finite State Machine

From a given state the transition path is restricted:

`fsm("idle", {idle: {activate: "active"}, active: {deactivate: "idle"}})`

If the transition is possible (e.g. `transition(state, "activate")`) it will be accepted, otherwise the state won't be updated.
