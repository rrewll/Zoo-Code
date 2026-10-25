import { reactConfig } from "@roo-code/config-eslint/react"
import { createProviderIdentifierConfig } from "@roo-code/config-eslint/provider-identifiers"
import { providerIdentifiers, retiredProviderIdentifiers } from "@roo-code/types/provider-identifiers"

/** @type {import("eslint").Linter.Config} */
export default [
	...reactConfig,
	createProviderIdentifierConfig({ providerIdentifiers, retiredProviderIdentifiers }),
	{
		rules: {
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					args: "all",
					ignoreRestSiblings: true,
					varsIgnorePattern: "^_",
					argsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],
			"@typescript-eslint/no-explicit-any": "off",
			"react/prop-types": "off",
			"react/display-name": "off",
		},
	},
	{
		files: ["src/components/chat/ChatRow.tsx", "src/components/settings/ModelInfoView.tsx"],
		rules: {
			"react/jsx-key": "off",
		},
	},
	{
		files: [
			"src/components/chat/ChatRow.tsx",
			"src/components/chat/ChatView.tsx",
			"src/components/chat/BrowserSessionRow.tsx",
			"src/components/history/useTaskSearch.ts",
		],
		rules: {
			"no-case-declarations": "off",
		},
	},
	{
		// Translations must come from the component's `t` (react-i18next's `useTranslation`), which changes
		// identity on a language switch; the global `t` gives React (and React Compiler caches) nothing to
		// invalidate on, so memoized output would keep the previous language.
		files: ["src/**/*.{ts,tsx}"],
		ignores: ["src/i18n/**"],
		rules: {
			"no-restricted-imports": [
				"error",
				{
					paths: [
						{
							name: "i18next",
							importNames: ["t"],
							message:
								"Use t from react-i18next's useTranslation so memoized output follows language changes.",
						},
					],
				},
			],
			"no-restricted-syntax": [
				"error",
				{
					selector: "MemberExpression[object.name='i18next'][property.name='t']",
					message: "Use t from react-i18next's useTranslation so memoized output follows language changes.",
				},
				{
					selector: "JSXOpeningElement[name.name='Trans']:not(:has(JSXAttribute[name.name='t']))",
					message:
						"Pass t={t} from useTranslation: Trans does not subscribe to language changes, so a cached <Trans> keeps the previous language.",
				},
			],
		},
	},
	{
		files: ["src/__mocks__/**/*.js"],
		rules: {
			"no-undef": "off",
		},
	},
]
