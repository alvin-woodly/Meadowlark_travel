import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files:["**/*.js"], languageOptions:{sourceType:"script", globals:globals.node}},
  {files:["**/*.js"], languageOptions:{sourceType:"commonjs"},rules:{"no-console":"off"}},
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {files:["**/*.test.js"],languageOptions:{globals:globals.jest}},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
];