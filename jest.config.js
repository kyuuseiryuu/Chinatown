/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  collectCoverage: true,
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
};