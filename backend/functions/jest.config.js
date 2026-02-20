const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  // 🔴 ADIÇÕES PARA CORRIGIR A EXECUÇÃO DUPLA
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testPathIgnorePatterns: ["/node_modules/", "/lib/"],
};
