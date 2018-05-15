export default function SubscriptionMonitor(decorated, updated){
  this.decorated = decorated
  this.updated = updated;
  this.count = 0;
}

export function subscriptionMonitor(decorated, updated){
  updated(false);
  return new SubscriptionMonitor(decorated, updated);
}