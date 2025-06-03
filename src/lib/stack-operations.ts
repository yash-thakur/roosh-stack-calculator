import { OperationResult } from "../types/stack";
import { prisma } from "./prisma";

export class StackCalculator {
	private static STACK_ID = 1; // Single stack instance

	static async initializeStack(): Promise<void> {
		const existingStack = await prisma.stack.findUnique({
			where: { id: this.STACK_ID },
		});

		if (!existingStack) {
			await prisma.stack.create({
				data: { id: this.STACK_ID, values: [] },
			});
		}
	}

	static async getStack(): Promise<number[]> {
		await this.initializeStack();
		const stack = await prisma.stack.findUnique({
			where: { id: this.STACK_ID },
		});
		return stack?.values || [];
	}

	static async updateStack(values: number[]): Promise<void> {
		await prisma.stack.upsert({
			where: { id: this.STACK_ID },
			update: { values },
			create: { id: this.STACK_ID, values },
		});
	}

	static async push(number: number): Promise<OperationResult> {
		try {
			const currentStack = await this.getStack();
			const newStack = [...currentStack, number];

			await this.updateStack(newStack);

			return {
				success: true,
				stack: newStack,
				operation: "push",
				message: `Added ${number} to stack`,
			};
		} catch (error) {
			return {
				success: false,
				stack: [],
				operation: "push",
				error: "Failed to push number to stack",
			};
		}
	}

	static async pop(): Promise<OperationResult> {
		try {
			const currentStack = await this.getStack();

			if (currentStack.length === 0) {
				return {
					success: false,
					stack: currentStack,
					operation: "pop",
					error: "Cannot pop from empty stack",
				};
			}

			const poppedValue = currentStack[currentStack.length - 1];
			const newStack = currentStack.slice(0, -1);

			await this.updateStack(newStack);

			return {
				success: true,
				stack: newStack,
				operation: "pop",
				message: `Removed ${poppedValue} from stack`,
			};
		} catch (error) {
			console.log("Error: ", error);
			return {
				success: false,
				stack: [],
				operation: "pop",
				error: "Failed to pop from stack",
			};
		}
	}

	static async performOperation(
		operation: "add" | "sub" | "mul" | "div"
	): Promise<OperationResult> {
		try {
			const currentStack = await this.getStack();

			if (currentStack.length < 2) {
				return {
					success: false,
					stack: currentStack,
					operation,
					error: `Cannot perform ${operation}: need at least 2 numbers in stack`,
				};
			}

			const first = currentStack[currentStack.length - 1];
			const second = currentStack[currentStack.length - 2];
			let result: number;

			switch (operation) {
				case "add":
					result = first + second;
					break;
				case "sub":
					result = first - second;
					break;
				case "mul":
					result = first * second;
					break;
				case "div":
					if (second === 0) {
						return {
							success: false,
							stack: currentStack,
							operation,
							error: "Division by zero is not allowed",
						};
					}
					result = first / second;
					break;
				default:
					throw new Error(`Unknown operation: ${operation}`);
			}

			const newStack = [...currentStack.slice(0, -2), result];

			await this.updateStack(newStack);

			return {
				success: true,
				stack: newStack,
				operation,
				message: `Performed ${operation}: ${first} ${operation} ${second} = ${result}`,
			};
		} catch (error) {
			return {
				success: false,
				stack: [],
				operation,
				error: `Failed to perform ${operation} operation`,
			};
		}
	}
}
