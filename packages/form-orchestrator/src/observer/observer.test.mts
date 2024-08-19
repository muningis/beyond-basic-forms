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
})
