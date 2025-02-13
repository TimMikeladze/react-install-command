import "../styles.css";

import { Icon } from "@iconify/react";
import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { InstallCommand, type Manager, cn, defaultManagers } from "..";
import { ComponentScreenshot } from "../ComponentScreenshot";

// Define types for the manager options
interface ManagerOptions {
	isDev?: boolean;
	isPeer?: boolean;
	isOptional?: boolean;
	isGlobal?: boolean;
	useShorthand?: boolean;
	version?: string;
	tag?: string;
	registry?: "npm" | "jsr";
}

// Define types for slot props
interface SlotProps {
	children?: ReactNode;
	className?: string;
}

interface TabSlotProps extends SlotProps {
	isSelected: boolean;
	onClick: () => void;
}

interface CopyButtonSlotProps extends SlotProps {
	onClick: () => void;
}

const meta = {
	title: "Components/InstallCommand",
	component: InstallCommand,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		packageName: { control: "text" },
		isDev: { control: "boolean" },
		isPeer: { control: "boolean" },
		isOptional: { control: "boolean" },
		isGlobal: { control: "boolean" },
		useShorthand: { control: "boolean" },
		version: { control: "text" },
		tag: { control: "text" },
		theme: {
			control: "select",
			options: ["light", "dark", "system"],
			description: "The color theme to use",
			defaultValue: "system",
		},
		commandPrefix: { control: "text" },
		registry: {
			control: "select",
			options: ["npm", "jsr"],
			description: "Package registry to use (for Deno packages)",
		},
		storageType: {
			control: "select",
			options: ["local", "session", "none"],
			description: "Storage type for persisting package manager selection",
			defaultValue: "none",
		},
		storageKey: {
			control: "text",
			description: "Storage key for persisting package manager selection",
		},
	},
} satisfies Meta<typeof InstallCommand>;

export default meta;
type Story = StoryObj<typeof meta>;

const packageName = "react-install-command";

// Basic usage with a package name
export const Basic: Story = {
	args: {
		packageName,
	},
};

// Installing as a dev dependency
export const DevDependency: Story = {
	args: {
		packageName,
		isDev: true,
	},
};

// Installing as a peer dependency
export const PeerDependency: Story = {
	args: {
		packageName,
		isPeer: true,
	},
};

// Installing as an optional dependency
export const OptionalDependency: Story = {
	args: {
		packageName,
		isOptional: true,
	},
};

// Installing globally
export const GlobalInstall: Story = {
	args: {
		packageName,
		isGlobal: true,
	},
};

// Using shorthand commands
export const ShorthandCommands: Story = {
	args: {
		packageName,
		useShorthand: true,
	},
};

// Installing specific version
export const SpecificVersion: Story = {
	args: {
		packageName,
		version: "^2.0.0",
	},
};

// Installing specific tag
export const SpecificTag: Story = {
	args: {
		packageName,
		tag: "beta",
	},
};

// Complex installation example
export const ComplexInstallation: Story = {
	args: {
		packageName,
		isDev: true,
		useShorthand: true,
		version: "^2.0.0",
	},
	parameters: {
		docs: {
			description: {
				story: "Demonstrates combining multiple installation options together.",
			},
		},
	},
};

// Custom default manager
export const CustomDefaultManager: Story = {
	args: {
		packageName: "react",
		managers: [
			defaultManagers[2], // pnpm
			defaultManagers[0], // npm
			defaultManagers[1], // yarn
		],
	},
	parameters: {
		docs: {
			description: {
				story: "Customizing the order of package managers.",
			},
		},
	},
};

// Custom styling example
export const CustomStyling: Story = {
	args: {
		packageName,
		slotClassNames: {
			root: "bg-gray-100 p-8",
			commandContainer: "bg-black",
			commandText: "text-white",
		},
	},
};

// Multiple packages
export const MultiplePackages: Story = {
	args: {
		packageName: "react react-dom @types/react @types/react-dom",
	},
};

// Custom commands
export const CustomCommands: Story = {
	args: {
		customCommands: {
			npm: "npm create vite@latest my-app",
			yarn: "yarn create vite my-app",
			pnpm: "pnpm create vite my-app",
		},
	},
};

// Limited package managers
export const LimitedManagers: Story = {
	args: {
		packageName: "express",
		managers: [
			{
				id: "npm",
				name: "npm",
				icon: () => (
					<Icon
						icon="logos:npm"
						width={24}
						height={24}
						aria-label="npm package manager"
					/>
				),
				getCommand: (pkg: string, options: ManagerOptions) => {
					const { isDev, useShorthand } = options;
					return `npm ${isDev ? (useShorthand ? "i -D" : "install -D") : useShorthand ? "i" : "install"} ${pkg}`;
				},
			},
			{
				id: "yarn",
				name: "Yarn",
				icon: () => (
					<Icon
						icon="logos:yarn"
						width={24}
						height={24}
						aria-label="Yarn package manager"
					/>
				),
				getCommand: (pkg: string, options: ManagerOptions) => {
					const { isDev } = options;
					return `yarn add ${isDev ? "-D" : ""} ${pkg}`;
				},
			},
		] as Manager[],
	},
};

// Custom prefix
export const CustomPrefix: Story = {
	args: {
		packageName,
		commandPrefix: ">",
	},
};

// Theme toggle example
export const ThemeToggle: Story = {
	args: {
		packageName: "react",
		theme: "dark",
	},
	parameters: {
		docs: {
			description: {
				story: "The component supports light, dark, and system color themes.",
			},
		},
	},
};

// Deno JSR package
export const DenoJsrPackage: Story = {
	args: {
		packageName: "@std/path",
		registry: "jsr",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Installing a package from the JSR registry (automatically selects Deno).",
			},
		},
	},
};

// Deno npm package
export const DenoNpmPackage: Story = {
	args: {
		packageName: "react",
		registry: "npm",
		managers: [defaultManagers[4]], // Only Deno manager
	},
	parameters: {
		docs: {
			description: {
				story:
					"Installing an npm package using only Deno as available manager.",
			},
		},
	},
};

// Deno multiple packages
export const DenoMultiplePackages: Story = {
	args: {
		packageName: "jsr:@std/path jsr:@std/assert npm:chalk",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Installing multiple packages from different registries (automatically detects Deno for JSR packages).",
			},
		},
	},
};

// Custom copy icon
export const CustomCopyIcon: Story = {
	args: {
		packageName,
		copyIcon: () => (
			<Icon
				icon="lucide:clipboard-copy"
				width={24}
				height={24}
				aria-label="Copy to clipboard"
			/>
		),
	},
	parameters: {
		docs: {
			description: {
				story: "Using a custom copy icon component.",
			},
		},
	},
};

// Custom className function
export const CustomClassNameFunction: Story = {
	args: {
		packageName,
		classNameFn: (...classes: string[]) =>
			classes.filter(Boolean).reverse().join(" "),
	},
	parameters: {
		docs: {
			description: {
				story: "Using a custom className concatenation function.",
			},
		},
	},
};

// Custom slots example
export const CustomSlots: Story = {
	args: {
		packageName: "react",
		slots: {
			root: ({ children, className }: SlotProps) => (
				<div className={className}>{children}</div>
			),
			navigation: ({ children, className }: SlotProps) => (
				<nav className={className}>{children}</nav>
			),
			tab: ({ children, isSelected, onClick, className }: TabSlotProps) => (
				<button
					type="button"
					onClick={onClick}
					data-state={isSelected ? "active" : "default"}
					className={className}
				>
					{children}
				</button>
			),
			commandContainer: ({ children, className }: SlotProps) => (
				<div className={className}>{children}</div>
			),
			commandPrefix: ({ className }: SlotProps) => (
				<span className={className}>$</span>
			),
			commandText: ({ children, className }: SlotProps) => (
				<code className={className}>{children}</code>
			),
			copyButton: ({ onClick, className }: CopyButtonSlotProps) => (
				<button
					type="button"
					onClick={onClick}
					className={className}
					aria-label="Copy command"
				>
					<Icon icon="lucide:copy" width={24} height={24} />
				</button>
			),
		},
	},
};

// Event handlers example
export const EventHandlers: Story = {
	args: {
		packageName: "react",
		onCopy: (command: string, manager: Manager) => {
			console.log(`Copied command: ${command} for ${manager.name}`);
		},
		onTabChange: (managerId: string, manager: Manager) => {
			console.log(`Switched to ${manager.name} (${managerId})`);
		},
	},
};

// Custom indicator example
export const CustomIndicator: Story = {
	args: {
		packageName,
		slotClassNames: {
			tabIndicator: "install-block-tab-indicator-centered",
		},
	},
	parameters: {
		docs: {
			description: {
				story: "Customizing the tab indicator appearance using CSS classes.",
			},
		},
	},
};

// Custom tab indicator with animation
export const AnimatedTabIndicator: Story = {
	args: {
		packageName,
		slotClassNames: {
			tabIndicator: "install-block-tab-indicator-animated",
		},
	},
	parameters: {
		docs: {
			description: {
				story:
					"Tab indicator with smooth transition animation when switching tabs.",
			},
		},
	},
};

// Custom tab indicator with border style
export const BorderTabIndicator: Story = {
	args: {
		packageName,
		slotClassNames: {
			tabIndicator: "install-block-tab-indicator-border",
		},
	},
	parameters: {
		docs: {
			description: {
				story: "Tab indicator using border style instead of background.",
			},
		},
	},
};

// Custom tab indicator with dot style
export const DotTabIndicator: Story = {
	args: {
		packageName,
		slotClassNames: {
			tabIndicator: "install-block-tab-indicator-dot",
		},
	},
	parameters: {
		docs: {
			description: {
				story: "Tab indicator using a dot style for a minimal look.",
			},
		},
	},
};

// Custom tab indicator with custom slot
export const CustomSlotTabIndicator: Story = {
	args: {
		packageName,
		slots: {
			tabIndicator: ({ isSelected, className }) => (
				<div
					className={cn("install-block-tab-indicator-custom", className)}
					data-state={isSelected ? "active" : "default"}
				>
					{isSelected && <span className="indicator-dot" />}
				</div>
			),
		},
	},
	parameters: {
		docs: {
			description: {
				story:
					"Custom tab indicator implementation using a custom slot component.",
			},
		},
	},
};

// Gradient indicator example
export const GradientIndicator: Story = {
	args: {
		packageName,
		slotClassNames: {
			tabIndicator: "install-block-tab-indicator-gradient",
		},
	},
	parameters: {
		docs: {
			description: {
				story: "Using a gradient indicator with CSS classes.",
			},
		},
	},
};

// Update FullCustomSlots story
export const FullCustomSlots: Story = {
	args: {
		packageName,
		slotClassNames: {
			root: "custom-root border-2 border-purple-500 rounded-lg",
			navigation: "custom-nav bg-gray-100 p-2",
			tab: "custom-tab bg-transparent hover:bg-purple-50 text-black data-[state=active]:bg-purple-500 data-[state=active]:text-white px-2 py-1 mx-1 rounded",
			tabIndicator: "install-block-tab-indicator-gradient",
			commandContainer: "custom-container p-4 bg-gray-50",
			commandPrefix: "custom-prefix text-purple-500",
			commandText: "custom-text text-purple-500 font-mono",
			copyButton:
				"custom-copy bg-purple-500 text-white px-2 py-1 rounded border-0",
		},
	},
	parameters: {
		docs: {
			description: {
				story:
					"Complete customization using CSS classes instead of inline styles.",
			},
		},
	},
};

// Callbacks example
export const WithCallbacks: Story = {
	args: {
		packageName,
		onCopy: (command, manager) => {
			console.log(`Copied command: ${command} for manager: ${manager.name}`);
			alert("Command copied to clipboard!");
		},
		onTabChange: (managerId, manager) => {
			console.log(`Switched to ${manager.name} (${managerId})`);
		},
	},
	parameters: {
		docs: {
			description: {
				story: "Demonstrating the use of onCopy and onTabChange callbacks.",
			},
		},
	},
};

// Combined features
export const CombinedFeatures: Story = {
	args: {
		packageName,
		isDev: true,
		version: "^1.0.0",
		useShorthand: true,
		theme: "dark",
		commandPrefix: "→",
		copyIcon: () => (
			<Icon
				icon="lucide:clipboard-copy"
				width={24}
				height={24}
				aria-label="Copy to clipboard"
			/>
		),
		slotClassNames: {
			root: "custom-root",
			commandText: "custom-text",
		},
		onCopy: (command) => console.log(`Copied: ${command}`),
	},
	parameters: {
		docs: {
			description: {
				story: "Combining multiple features and customizations together.",
			},
		},
	},
};

// Storage persistence examples
export const LocalStorage: Story = {
	args: {
		packageName,
		storageType: "local",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Persists package manager selection in localStorage (survives browser restarts).",
			},
		},
	},
};

export const SessionStorage: Story = {
	args: {
		packageName,
		storageType: "session",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Persists package manager selection in sessionStorage (cleared when browser closes).",
			},
		},
	},
};

export const CustomStorageKey: Story = {
	args: {
		packageName,
		storageType: "local",
		storageKey: "my-custom-pm-key",
	},
	parameters: {
		docs: {
			description: {
				story: "Using a custom storage key for persistence.",
			},
		},
	},
};

// Screenshot example story
export const WithScreenshotCapability: Story = {
	render: () => (
		<ComponentScreenshot>
			<InstallCommand packageName="react-install-command" />
		</ComponentScreenshot>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Component with screenshot capability - click the camera button to download a PNG of the component.",
			},
		},
	},
};

// Thick tab indicator
export const ThickTabIndicator: Story = {
	args: {
		packageName,
		slotClassNames: {
			tabIndicator: "install-block-tab-indicator-thick",
		},
	},
	parameters: {
		docs: {
			description: {
				story: "Tab indicator with increased thickness (4px).",
			},
		},
	},
};

// Thicker tab indicator
export const ThickerTabIndicator: Story = {
	args: {
		packageName,
		slotClassNames: {
			tabIndicator: "install-block-tab-indicator-thicker",
		},
	},
	parameters: {
		docs: {
			description: {
				story:
					"Tab indicator with more thickness (6px) and rounded top corners.",
			},
		},
	},
};

// Thickest tab indicator
export const ThickestTabIndicator: Story = {
	args: {
		packageName,
		slotClassNames: {
			tabIndicator: "install-block-tab-indicator-thickest",
		},
	},
	parameters: {
		docs: {
			description: {
				story:
					"Tab indicator with maximum thickness (8px) and rounded top corners.",
			},
		},
	},
};

// Thick gradient tab indicator
export const ThickGradientIndicator: Story = {
	args: {
		packageName,
		slotClassNames: {
			tabIndicator:
				"install-block-tab-indicator-gradient install-block-tab-indicator-thick",
		},
	},
	parameters: {
		docs: {
			description: {
				story: "Combining thick style with gradient effect.",
			},
		},
	},
};
