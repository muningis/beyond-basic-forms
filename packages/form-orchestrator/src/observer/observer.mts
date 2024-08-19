interface Subscription {
  id: string;
  change?: string;
}

interface Subscriber {
  key: Subscription;
  callback: (data: any) => void;
}

export class Observer {
  private subscribers: Subscriber[] = [];

  sub(key: Subscription, callback: (data: any) => void) {
    const subscription = { key, callback };
    this.subscribers.push(subscription);

    return () => {
      this.subscribers = this.subscribers.filter(subscriber => subscriber !== subscription);
    }
  }

  pub(filter: Subscription, value: any) {
    this.subscribers.filter(subscriber => {
      return subscriber.key.id === filter.id &&
        (typeof subscriber.key.change === "undefined" || subscriber.key.change === filter.change)
    })?.forEach(subscriber => subscriber.callback(value));
  }
}
