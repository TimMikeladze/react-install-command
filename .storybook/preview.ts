import { themes } from "@storybook/theming";

import type { Preview } from "@storybook/react";

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
	},
	// @ts-expect-error
	darkMode: {
		current: "dark",
		// Override the default dark theme
		dark: { ...themes.dark, appBg: "black" },
		// Override the default light theme
		light: { ...themes.normal, appBg: "red" },
	},
};

export default preview;
