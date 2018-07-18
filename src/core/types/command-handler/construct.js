export default function CommandHandler(handle, state, events){
  this.handle = handle;
  this.state = state;
  this.events = events;
}

export function commandHandler(handle, state, events){
  return new CommandHandler(handle, state, events);
}