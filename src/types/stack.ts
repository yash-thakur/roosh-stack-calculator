export interface StackResponse {
	success: boolean;
	data?: number[];
	message?: string;
	error?: string;
}

export interface OperationResult {
	success: boolean;
	stack: number[];
	operation: StackOperation;
	message?: string;
	error?: string;
}

export type StackOperation = "add" | "sub" | "mul" | "div" | "push" | "pop";
