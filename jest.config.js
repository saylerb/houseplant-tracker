module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.svelte$": ["jest-transform-svelte"]
  },
  moduleFileExtensions: ["js", "svelte"],
  moduleNameMapper: {
    "proposal-temporal/lib/index.mjs": "proposal-temporal"
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"]
};
