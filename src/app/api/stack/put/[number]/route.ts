import { NextRequest, NextResponse } from "next/server";

import { StackCalculator } from "../../../../../lib/stack-operations";

export async function POST(
	request: NextRequest,
	{ params }: { params: { number: string } }
): Promise<NextResponse> {
	try {
		const numberStr = params.number;
		const number = parseFloat(numberStr);

		if (isNaN(number)) {
			return NextResponse.json(
				{
					success: false,
					error: "Invalid number provided",
				},
				{ status: 400 }
			);
		}

		const result = await StackCalculator.push(number);

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
