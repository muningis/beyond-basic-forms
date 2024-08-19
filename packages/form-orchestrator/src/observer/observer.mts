interface Subscriber {
  key: string;
  callback: (data: any) => void;
}
export class Observer {
  private subscribers: Subscriber[] = [];
  sub(key: string, callback: (data: any) => void) {
    const subscription = { key, callback };
    this.subscribers.push(subscription);
  }
  pub(key: string, value: any) {
    this.subscribers.find(subscriber => subscriber.key === key)?.callback(value);
  }
}
