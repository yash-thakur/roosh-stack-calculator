import { StackCalculator } from "../src/lib/stack-operations";
import { prisma } from "../src/lib/prisma";

// Force Jest to use the mock
jest.mock("../src/lib/prisma", () => {
	return {
		prisma: {
			stack: {
				findUnique: jest.fn(),
				create: jest.fn(),
				upsert: jest.fn(),
			},
		},
	};
});

describe("StackCalculator", () => {
	const STACK_ID = 1;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("initializeStack", () => {
		it("should create stack if not exists", async () => {
			(prisma.stack.findUnique as jest.Mock).mockResolvedValue(null);
			await StackCalculator.initializeStack();

			expect(prisma.stack.create).toHaveBeenCalledWith({
				data: { id: STACK_ID, values: [] },
			});
		});

		it("should not create stack if it already exists", async () => {
			(prisma.stack.findUnique as jest.Mock).mockResolvedValue({
				id: STACK_ID,
				values: [1, 2],
			});
			await StackCalculator.initializeStack();

			expect(prisma.stack.create).not.toHaveBeenCalled();
		});
	});

	describe("getStack", () => {
		it("should return stack values", async () => {
			(prisma.stack.findUnique as jest.Mock).mockResolvedValue({
				id: STACK_ID,
				values: [10, 20],
			});

			const result = await StackCalculator.getStack();
			expect(result).toEqual([10, 20]);
		});

		it("should return empty array if no stack found", async () => {
			(prisma.stack.findUnique as jest.Mock).mockResolvedValue(null);

			const result = await StackCalculator.getStack();
			expect(result).toEqual([]);
		});
	});

	describe("push", () => {
		it("should push number to stack", async () => {
			(prisma.stack.findUnique as jest.Mock).mockResolvedValue({
				id: STACK_ID,
				values: [1, 2],
			});
			(prisma.stack.upsert as jest.Mock).mockResolvedValue({});

			const result = await StackCalculator.push(3);
			expect(result.success).toBe(true);
			expect(result.stack).toEqual([1, 2, 3]);
		});
	});

	describe("pop", () => {
		it("should pop number from stack", async () => {
			(prisma.stack.findUnique as jest.Mock).mockResolvedValue({
				id: STACK_ID,
				values: [1, 2],
			});
			(prisma.stack.upsert as jest.Mock).mockResolvedValue({});

			const result = await StackCalculator.pop();
			expect(result.success).toBe(true);
			expect(result.stack).toEqual([1]);
		});

		it("should return error if stack is empty", async () => {
			(prisma.stack.findUnique as jest.Mock).mockResolvedValue({
				id: STACK_ID,
				values: [],
			});

			const result = await StackCalculator.pop();
			expect(result.success).toBe(false);
			expect(result.error).toBe("Cannot pop from empty stack");
		});
	});

	describe("performOperation", () => {
		it("should perform addition", async () => {
			(prisma.stack.findUnique as jest.Mock).mockResolvedValue({
				id: STACK_ID,
				values: [2, 3],
			});
			(prisma.stack.upsert as jest.Mock).mockResolvedValue({});

			const result = await StackCalculator.performOperation("add");
			expect(result.success).toBe(true);
			expect(result.stack).toEqual([5]);
		});

		it("should not divide by zero", async () => {
			(prisma.stack.findUnique as jest.Mock).mockResolvedValue({
				id: STACK_ID,
				values: [0, 2],
			});

			const result = await StackCalculator.performOperation("div");
			expect(result.success).toBe(false);
			expect(result.error).toBe("Division by zero is not allowed");
		});

		it("should return error if insufficient stack", async () => {
			(prisma.stack.findUnique as jest.Mock).mockResolvedValue({
				id: STACK_ID,
				values: [1],
			});

			const result = await StackCalculator.performOperation("mul");
			expect(result.success).toBe(false);
			expect(result.error).toMatch(/need at least 2 numbers/);
		});
	});
});
