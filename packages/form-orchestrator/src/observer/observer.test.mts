import { describe, it, expect, vitest } from "vitest";
import { Observer } from "./observer.mjs";

describe("#Observer()", () => {
  it("should be able to subscribe to an event and receive payload from publisher", () => {
    const observer = new Observer();

    const spy = vitest.fn();

    observer.sub({ id: "first_name" }, spy);

    observer.pub({ id: "first_name", change: "value" }, "John");
    expect(spy).toHaveBeenLastCalledWith({ value: "John" });

    observer.pub({ id: "first_name", change: "visible" }, false);
    expect(spy).toHaveBeenLastCalledWith({ visible: false });
  });

  it("should be able to subscribe to single change event and receive payload from publisher", () => {
    const observer = new Observer();

    const spy = vitest.fn();

    observer.sub({ id: "first_name", change: "value" }, spy);

    observer.pub({ id: "first_name", change: "value" }, "John");
    expect(spy).toHaveBeenLastCalledWith({ value: "John" });
    expect(spy).toHaveBeenCalledTimes(1);

    observer.pub({ id: "first_name", change: "visible" }, false);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should be able to batch subscription triggers", () => {
    const observer = new Observer();

    const spy = vitest.fn();

    observer.sub({ id: "first_name" }, spy);

    observer.batch(() => {
      observer.pub({ id: "first_name", change: "value" }, "John");
      observer.pub({ id: "first_name", change: "visible" }, false);
    });
    expect(spy).toHaveBeenLastCalledWith({ value: "John", visible: false });
  });

  it("should be able to unsubsubscribe from an event", () => {
    const observer = new Observer();

    const spy = vitest.fn();
    const unsub = observer.sub({ id: "first_name", change: "value" }, spy);
    unsub();

    observer.pub({ id: "first_name", change: "value" }, "John");

    expect(spy).not.toHaveBeenLastCalledWith("John!");
  });

  it.only("should be able to maintain three different subscriptions and unsubscribing from one of them", () => {
    const observer = new Observer();

    const spyOnValue = vitest.fn();
    const spyOnVisible = vitest.fn();
    const spyOnAll = vitest.fn();

    observer.sub({ id: "first_name", change: "value" }, spyOnValue);
    observer.sub({ id: "first_name", change: "visible" }, spyOnVisible);
    const unsubSpyOnAll = observer.sub({ id: "first_name" }, spyOnAll);

    observer.batch(() => {
      observer.pub({ id: "first_name", change: "value" }, "John");
      observer.pub({ id: "first_name", change: "visible" }, true);
    });

    expect(spyOnAll).toHaveBeenCalledTimes(1);
    expect(spyOnAll).toHaveBeenCalledWith({ value: "John", visible: true });

    expect(spyOnValue).toHaveBeenCalledTimes(1);
    expect(spyOnValue).toHaveBeenCalledWith({ value: "John" });

    expect(spyOnVisible).toHaveBeenCalledTimes(1);
    expect(spyOnVisible).toHaveBeenCalledWith({ visible: true });

    unsubSpyOnAll();

    observer.batch(() => {
      observer.pub({ id: "first_name", change: "value" }, "");
      observer.pub({ id: "first_name", change: "visible" }, false);
    });

    expect(spyOnAll).toHaveBeenCalledTimes(1);
    expect(spyOnAll).toHaveBeenCalledWith({ value: "John", visible: true });

    expect(spyOnValue).toHaveBeenCalledTimes(2);
    expect(spyOnValue).toHaveBeenCalledWith({ value: "" });

    expect(spyOnVisible).toHaveBeenCalledTimes(2);
    expect(spyOnVisible).toHaveBeenCalledWith({ visible: false });
  });
})
