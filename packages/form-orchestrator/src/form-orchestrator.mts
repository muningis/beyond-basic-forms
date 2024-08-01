class FormOrchestrator {
	subscribe(...args: unknown[]) {
		throw new Error("Not yet implemented!");
	}

	setValue(id: string, value: string) {
		throw new Error("Not yet implemented!");
	}
}

if (import.meta.vitest) {
	const { describe, it, expect, vitest } = import.meta.vitest;

	describe("FormOrchestrator", () => {
		it("should be able to subscribe to observer", () => {
			const spyFn = vitest.fn();
			const form = new FormOrchestrator();

			expect(() => form.subscribe({ id: "first_name" }, spyFn)).not.toThrow();
		});

		it("should react to publishes", () => {
			const spyFn = vitest.fn();
			const form = new FormOrchestrator();

			form.subscribe({ id: "first_name" }, spyFn);
			form.setValue("first_name", "John");
			expect(spyFn).toBeCalledWith({ value: "John" });
		});
	});
}
