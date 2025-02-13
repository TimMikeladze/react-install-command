import "../styles.css";

import { Icon } from "@iconify/react";
import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { InstallCommand, type Manager, defaultManagers } from "..";
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

// Full slots customization
export const FullCustomSlots: Story = {
	args: {
		packageName,
		slots: {
			root: ({ children, className }) => (
				<div
					className={className}
					style={{ border: "2px solid purple", borderRadius: "8px" }}
				>
					{children}
				</div>
			),
			navigation: ({ children }) => (
				<nav style={{ background: "#f0f0f0", padding: "8px" }}>{children}</nav>
			),
			tab: ({ children, isSelected, onClick }) => (
				<button
					type="button"
					onClick={onClick}
					style={{
						background: isSelected ? "purple" : "transparent",
						color: isSelected ? "white" : "black",
						padding: "4px 8px",
						margin: "0 4px",
						border: "none",
						borderRadius: "4px",
					}}
				>
					{children}
				</button>
			),
			commandContainer: ({ children }) => (
				<div style={{ padding: "16px", background: "#fafafa" }}>{children}</div>
			),
			commandPrefix: () => <span style={{ color: "purple" }}>$</span>,
			commandText: ({ children }) => (
				<code style={{ color: "purple", fontFamily: "monospace" }}>
					{children}
				</code>
			),
			copyButton: ({ onClick }) => (
				<button
					type="button"
					onClick={onClick}
					style={{
						background: "purple",
						color: "white",
						padding: "4px 8px",
						borderRadius: "4px",
						border: "none",
					}}
				>
					Copy
				</button>
			),
		},
	},
	parameters: {
		docs: {
			description: {
				story:
					"Complete customization of all available slots with custom styling and behavior.",
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
2;
