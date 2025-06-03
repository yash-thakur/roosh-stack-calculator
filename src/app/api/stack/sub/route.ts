import { NextRequest, NextResponse } from "next/server";

import { StackCalculator } from "../../../../lib/stack-operations";

export async function POST(): Promise<NextResponse> {
	try {
		const result = await StackCalculator.performOperation("sub");

		if (!result.success) {
			return NextResponse.json(result, { status: 400 });
		}

		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: "Internal server error",
			},
			{ status: 500 }
		);
	}
}
