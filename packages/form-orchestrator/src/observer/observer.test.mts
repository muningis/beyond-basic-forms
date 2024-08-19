import { describe, it, expect, vitest } from "vitest";
import { Observer } from "./observer.mjs";

describe("#Observer()", () => {
  it("should be able to subscribe to an event and receive payload from publisher", () => {
    const observer = new Observer();

    const spy = vitest.fn();

    observer.sub("vitest", spy);

    observer.pub("vitest", "Hello world!");

    expect(spy).toHaveBeenLastCalledWith("Hello world!");
  });
  it("should be able to unsubsubscribe from an event", () => {
    const observer = new Observer();

    const spy = vitest.fn();
    const unsub = observer.sub("vitest", spy);
    unsub();

    observer.pub("vitest", "Hello world!");

    expect(spy).not.toHaveBeenLastCalledWith("Hello world!");
  });
})
