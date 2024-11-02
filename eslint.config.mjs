import globals from "globals";
import tseslint from "typescript-eslint";

export default [
	{
		ignores: ["dist/**/*", "__tests__/**/*"],
	},
	{ languageOptions: { globals: { ...globals.node } } },
	...tseslint.configs.recommended,
	{
		rules: {
			curly: ["error", "all"],
			"no-else-return": ["error", { allowElseIf: false }],
			camelcase: [
				"error",
				{
					properties: "always",
					ignoreDestructuring: false,
					allow: ["^[a-z]+(_[a-z]+)+$"],
				},
			],
			quotes: ["error", "double", { avoidEscape: true }],
			semi: ["error", "always"],
			"space-before-function-paren": [
				"error",
				{
					anonymous: "always",
					named: "never",
					asyncArrow: "always",
				},
			],
			indent: [
				"error",
				"tab",
				{
					SwitchCase: 1,
					VariableDeclarator: { var: 1, let: 1, const: 1 },
					outerIIFEBody: 1,
					MemberExpression: 1,
					FunctionDeclaration: { parameters: 1, body: 1 },
					FunctionExpression: { parameters: 1, body: 1 },
					CallExpression: { arguments: 1 },
					ArrayExpression: 1,
					ObjectExpression: 1,
					ImportDeclaration: 1,
					flatTernaryExpressions: false,
					ignoreComments: false,
					ignoredNodes: ["ConditionalExpression"],
				},
			],
			"no-tabs": ["error", { allowIndentationTabs: true }],
			"no-unused-vars": [
				"error",
				{ varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
			],
			"@typescript-eslint/ban-ts-comment": "off",
		},
	},
];
