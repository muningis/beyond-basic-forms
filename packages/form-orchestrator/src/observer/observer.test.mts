import { describe, it, expect, vitest } from "vitest";
import { Observer } from "./observer.mjs";

describe("#Observer()", () => {
  it("should be able to subscribe to an event and receive payload from publisher", () => {
    const observer = new Observer();

    const spy = vitest.fn();

    observer.sub({ id: "first_name" }, spy);

    observer.pub({ id: "first_name" }, "John");

    expect(spy).toHaveBeenLastCalledWith("John");
  });

  it("should be able to unsubsubscribe from an event", () => {
    const observer = new Observer();

    const spy = vitest.fn();
    const unsub = observer.sub({ id: "first_name" }, spy);
    unsub();

    observer.pub({ id: "first_name" }, "John");

    expect(spy).not.toHaveBeenLastCalledWith("John!");
  });
})
