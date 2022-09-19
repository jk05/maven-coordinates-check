import type { Config } from "@jest/types";

export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverage: false,
    collectCoverageFrom: ["src/**/*.ts"],
    coverageReporters: ["text-summary", "html"],
  };
};
