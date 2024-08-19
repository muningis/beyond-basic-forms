type AccumulatedChanges = {
  [id: string]: {
    [change: string]: any;
  };
};

interface Subscription {
  id: string;
  change?: string;
}

interface Subscriber {
  key: Subscription;
  callback: (data: any) => void;
}

export class Observer {
  private accumulatedChanges: AccumulatedChanges = {};
  private isBatching = false;
  private subscribers: Subscriber[] = [];

  sub(key: Subscription, callback: (data: any) => void) {
    const subscription = { key, callback };
    this.subscribers.push(subscription);

    return () => {
      this.subscribers = this.subscribers.filter(subscriber => subscriber !== subscription);
    }
  }

  pub(filter: Required<Subscription>, value: any) {
    this.accumulatedChanges[filter.id] ??= {};
    this.accumulatedChanges[filter.id]![filter.change!] = value;
    if (this.isBatching) return;
    this.triggerCallbacks(filter.id);
  }

  batch(fn: () => void) {
    this.isBatching = true;
    fn();
    this.isBatching = false;

    Object.keys(this.accumulatedChanges).forEach(id => {
      this.triggerCallbacks(id);
    });
  }

  private triggerCallbacks(id: string) {
    const changes = this.accumulatedChanges[id]!;
    Object.keys(changes).forEach(change => {
      this.subscribers.forEach(subscriber => {
        if (this.isMatch(subscriber.key, { id, change })) {
          if (subscriber.key.change) {
            subscriber.callback({ [change]: changes[change] });
          } else {
            subscriber.callback(changes);
          }
        }
      });
    });
    delete this.accumulatedChanges[id];
  }

  private isMatch(subscriberFilter: Subscription, publishFilter: Required<Subscription>): boolean {
    return Object.entries(subscriberFilter).every(([key, value]) => {
      console.log(key, value, subscriberFilter, publishFilter)
      if (key === 'change' && subscriberFilter.change && publishFilter.change) {
        return subscriberFilter.change === publishFilter.change;
      }
      return publishFilter.hasOwnProperty(key) && publishFilter[key as keyof Subscription] === value;
    });
  }
}
