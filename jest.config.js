const config = {
	preset: "ts-jest",
	testEnvironment: "node",
	clearMocks: true,
	moduleFileExtensions: ["ts", "js", "json"],
	testMatch: ["**/tests/**/*.test.ts"],
};

export default config;
