import type { StorybookConfig } from "@storybook/react-webpack5";
const config: StorybookConfig = {
	stories: ["../src/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		"@storybook/addon-webpack5-compiler-swc",
		"storybook-dark-mode",
	],
	framework: {
		name: "@storybook/react-webpack5",
		options: {
			builder: {
				useSWC: true,
			},
		},
	},
	swc: () => ({
		jsc: {
			transform: {
				react: {
					runtime: "automatic",
				},
			},
		},
	}),
	docs: {
		autodocs: "tag",
	},
	previewHead: (head) => `
    ${head}
    ${
			process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID &&
			process.env.NEXT_PUBLIC_UMAMI_URL
				? `
    <script
      defer
      src="${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js"
      data-website-id="${process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}"
    ></script>
    `
				: ""
		}
	<meta name="title" content="react-install-command" />
	<meta name="description" content="A React component for rendering a 'npm install package-name' command block. Supports multiple package managers and themes. Drop it into your MDX code, a ShadCN UI component, a Tailwind codebase, use built-in styles or go unstyled. You choose." />
  `,
};
export default config;
