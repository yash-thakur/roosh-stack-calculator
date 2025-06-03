import { NextRequest, NextResponse } from "next/server";

import { StackCalculator } from "../../../lib/stack-operations";

export async function GET(): Promise<NextResponse> {
	try {
		const stack = await StackCalculator.getStack();
		return NextResponse.json({
			success: true,
			data: stack,
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: "Failed to retrieve stack",
			},
			{ status: 500 }
		);
	}
}
