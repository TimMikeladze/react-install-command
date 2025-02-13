"use client";

import { Icon } from "@iconify/react";
import React from "react";
import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type Theme = "light" | "dark" | "system";

export interface Manager {
	id: string;
	name: string;
	icon: () => JSX.Element;
	getCommand: (
		packageName: string,
		options: {
			isDev?: boolean;
			isPeer?: boolean;
			isOptional?: boolean;
			isGlobal?: boolean;
			useShorthand?: boolean;
			version?: string;
			tag?: string;
			registry?: "npm" | "jsr";
		},
	) => string;
}

export interface SlotProps {
	className?: string;
	children?: ReactNode;
}

export interface TabSlotProps extends SlotProps {
	isSelected: boolean;
	onClick: () => void;
}

export interface CopyButtonSlotProps extends SlotProps {
	onClick: () => void;
}

export interface Slots {
	root?: (props: SlotProps) => ReactNode;
	navigation?: (props: SlotProps) => ReactNode;
	tab?: (props: TabSlotProps) => ReactNode;
	commandContainer?: (props: SlotProps) => ReactNode;
	commandPrefix?: (props: SlotProps) => ReactNode;
	commandText?: (props: SlotProps) => ReactNode;
	copyButton?: (props: CopyButtonSlotProps) => ReactNode;
}

export interface SlotClassNames {
	root?: string;
	navigation?: string;
	tab?: string;
	commandContainer?: string;
	commandPrefix?: string;
	commandText?: string;
	copyButton?: string;
	tabIcon?: string;
	tabText?: string;
	commandGroup?: string;
	commandTextCommand?: string;
	copyButtonIcon?: string;
}

export interface IconProps {
	icon: string;
	width?: number;
	height?: number;
	className?: string;
	"aria-label"?: string;
}

export const cn = (...classes: (string | undefined)[]) => {
	return classes.filter(Boolean).join(" ");
};

export const defaultCopyIcon = () => (
	<Icon
		icon="lucide:copy"
		width={24}
		height={24}
		aria-label="Copy to clipboard"
	/>
);

export const defaultManagers: Manager[] = [
	{
		id: "npm",
		name: "npm",
		icon: () => (
			<Icon
				icon="logos:npm-icon"
				width={24}
				height={24}
				aria-label="npm package manager"
			/>
		),
		getCommand: (pkg: string, options) => {
			const {
				isDev,
				isPeer,
				isOptional,
				isGlobal,
				useShorthand,
				version,
				tag,
			} = options;

			const command = useShorthand ? "i" : "install";
			const flags = [
				isDev && (useShorthand ? "-D" : "--save-dev"),
				isPeer && "--save-peer",
				isOptional && "--save-optional",
				isGlobal && "-g",
			]
				.filter(Boolean)
				.join(" ");

			const pkgWithVersion = version
				? `${pkg}@${version}`
				: tag
					? `${pkg}@${tag}`
					: pkg;

			return `npm ${command}${flags ? ` ${flags}` : ""} ${pkgWithVersion}`;
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
		getCommand: (pkg: string, options) => {
			const { isDev, isPeer, isOptional, isGlobal, version, tag } = options;

			const flags = [
				isGlobal && "global",
				"add",
				isDev && "--dev",
				isPeer && "--peer",
				isOptional && "--optional",
			]
				.filter(Boolean)
				.join(" ");

			const pkgWithVersion = version
				? `${pkg}@${version}`
				: tag
					? `${pkg}@${tag}`
					: pkg;

			return `yarn ${flags} ${pkgWithVersion}`;
		},
	},
	{
		id: "pnpm",
		name: "pnpm",
		icon: () => (
			<Icon
				icon="logos:pnpm"
				width={24}
				height={24}
				aria-label="pnpm package manager"
			/>
		),
		getCommand: (pkg: string, options) => {
			const {
				isDev,
				isPeer,
				isOptional,
				isGlobal,
				useShorthand,
				version,
				tag,
			} = options;

			const flags = [
				isGlobal && "-g",
				isDev && "-D",
				isPeer && "-P",
				isOptional && "-O",
			]
				.filter(Boolean)
				.join(" ");

			const pkgWithVersion = version
				? `${pkg}@${version}`
				: tag
					? `${pkg}@${tag}`
					: pkg;

			return `pnpm add${flags ? ` ${flags}` : ""} ${pkgWithVersion}`;
		},
	},
	{
		id: "bun",
		name: "Bun",
		icon: () => (
			<Icon
				icon="logos:bun"
				width={24}
				height={24}
				aria-label="Bun package manager"
			/>
		),
		getCommand: (pkg: string, options) => {
			const { isDev, isPeer, isOptional, isGlobal, version, tag } = options;

			const flags = [
				isGlobal && "-g",
				isDev && "-d",
				isPeer && "--peer",
				isOptional && "--optional",
			]
				.filter(Boolean)
				.join(" ");

			const pkgWithVersion = version
				? `${pkg}@${version}`
				: tag
					? `${pkg}@${tag}`
					: pkg;

			return `bun add${flags ? ` ${flags}` : ""} ${pkgWithVersion}`;
		},
	},
	{
		id: "deno",
		name: "Deno",
		icon: () => (
			<Icon
				icon="logos:deno"
				width={24}
				height={24}
				aria-label="Deno package manager"
			/>
		),
		getCommand: (pkg: string, options) => {
			const { version, tag, registry } = options;

			// Split multiple packages and process each one
			const packages = pkg.split(/\s+/).map((p) => {
				// If package already has a prefix (jsr: or npm:), use it as is
				if (p.startsWith("jsr:") || p.startsWith("npm:")) {
					return p;
				}

				// If registry is explicitly set, use that
				if (registry) {
					return `${registry}:${p}`;
				}

				// If no registry is set and no prefix exists, assume npm
				return `npm:${p}`;
			});

			// Add version or tag if specified
			const packagesWithVersion = packages.map((p) => {
				return version ? `${p}@${version}` : tag ? `${p}@${tag}` : p;
			});

			return `deno add ${packagesWithVersion.join(" ")}`;
		},
	},
];

export const defaultSlots = {
	root: ({ children, className }: SlotProps) => (
		<div className={cn("install-block", className)}>{children}</div>
	),
	navigation: ({ children, className }: SlotProps) => (
		<div className={cn("install-block-nav", className)}>{children}</div>
	),
	tab: ({
		children,
		isSelected,
		onClick,
		className,
		slotClassNames,
	}: TabSlotProps & { slotClassNames?: SlotClassNames }) => (
		<button
			type="button"
			onClick={onClick}
			data-state={isSelected ? "active" : "default"}
			className={cn("install-block-tab", className)}
		>
			{React.Children.map(children, (child) => {
				if (React.isValidElement(child)) {
					if (child.type === Icon) {
						return React.cloneElement(child as React.ReactElement<IconProps>, {
							className: cn(child.props.className, slotClassNames?.tabIcon),
						});
					}
					if (child.type === "span") {
						return React.cloneElement(
							child as React.ReactElement<{ className?: string }>,
							{
								className: cn(child.props.className, slotClassNames?.tabText),
							},
						);
					}
				}
				return child;
			})}
		</button>
	),
	commandContainer: ({ children, className }: SlotProps) => (
		<div className={cn("install-block-content", className)}>{children}</div>
	),
	commandPrefix: ({ className }: SlotProps) => (
		<span className={cn("install-block-prefix", className)}>$</span>
	),
	commandText: ({
		children,
		className,
		slotClassNames,
	}: SlotProps & { slotClassNames?: SlotClassNames }) => {
		const text = String(children);
		const parts = text.split(/\s+/);
		const command = parts[0];
		const rest = parts.slice(1).join(" ");

		return (
			<code className={cn("install-block-text", className)}>
				<span
					className={cn(
						"install-block-text-command",
						slotClassNames?.commandTextCommand || "",
					)}
				>
					{command}
				</span>
				{rest ? ` ${rest}` : ""}
			</code>
		);
	},
	copyButton: ({ onClick, className }: CopyButtonSlotProps) => (
		<button
			type="button"
			onClick={onClick}
			className={cn("install-block-copy", className)}
			aria-label="Copy command"
		>
			{defaultCopyIcon()}
		</button>
	),
};

export type StorageType = "local" | "session" | "none";

export interface InstallCommandProps {
	/**
	 * The name of the package to generate install commands for
	 */
	packageName?: string;

	/**
	 * Whether to install as a dev dependency
	 * @default false
	 */
	isDev?: boolean;

	/**
	 * Whether to install as a peer dependency
	 * @default false
	 */
	isPeer?: boolean;

	/**
	 * Whether to install as an optional dependency
	 * @default false
	 */
	isOptional?: boolean;

	/**
	 * Whether to install globally
	 * @default false
	 */
	isGlobal?: boolean;

	/**
	 * Whether to use shorthand commands (e.g. 'npm i' instead of 'npm install')
	 * @default false
	 */
	useShorthand?: boolean;

	/**
	 * Version range for the package (e.g. "^1.0.0", "~2.0.0")
	 */
	version?: string;

	/**
	 * Tag for the package (e.g. "latest", "next", "beta")
	 */
	tag?: string;

	/**
	 * Package registry to use (for Deno packages)
	 * @default undefined
	 */
	registry?: "npm" | "jsr";

	/**
	 * Array of package managers to display
	 * @default defaultManagers
	 */
	managers?: Manager[];

	/**
	 * Custom commands to override the default ones
	 */
	customCommands?: Record<string, string>;

	/**
	 * Custom slot components for rendering
	 */
	slots?: Slots;

	/**
	 * Custom classNames for each slot and nested elements
	 */
	slotClassNames?: SlotClassNames;

	/**
	 * Callback fired when the command is copied
	 * @param command The command that was copied
	 * @param manager The current package manager
	 */
	onCopy?: (command: string, manager: Manager) => void;

	/**
	 * Callback fired when the selected package manager changes
	 * @param managerId The ID of the newly selected manager
	 * @param manager The newly selected manager object
	 */
	onTabChange?: (managerId: string, manager: Manager) => void;

	/**
	 * The color theme to use
	 * @default "system"
	 */
	theme?: Theme;

	/**
	 * Custom copy icon component
	 * @default defaultCopyIcon
	 */
	copyIcon?: () => JSX.Element;

	/**
	 * Custom class name concatenation function
	 * @default cn
	 */
	classNameFn?: (...classes: string[]) => string;

	/**
	 * Custom prefix symbol to show before the command
	 * @default "$"
	 */
	commandPrefix?: string;

	/**
	 * Storage type for persisting package manager selection
	 * @default "none"
	 */
	storageType?: StorageType;

	/**
	 * Storage key for persisting package manager selection
	 * @default "preferred-package-manager"
	 */
	storageKey?: string;
}

export const InstallCommand = ({
	packageName = "",
	isDev = false,
	isPeer = false,
	isOptional = false,
	isGlobal = false,
	useShorthand = false,
	version,
	tag,
	registry,
	managers = defaultManagers,
	customCommands,
	slots = {},
	slotClassNames = {},
	onCopy,
	onTabChange,
	theme = "system",
	copyIcon = defaultCopyIcon,
	classNameFn = cn,
	commandPrefix = "$",
	storageType = "none",
	storageKey = "preferred-package-manager",
}: InstallCommandProps) => {
	// Detect initial manager based on command and storage
	const detectInitialManager = useCallback(() => {
		// Try to get from storage first if enabled
		if (storageType !== "none") {
			const storage = storageType === "local" ? localStorage : sessionStorage;
			const stored = storage.getItem(storageKey);
			if (stored && managers.some((m) => m.id === stored)) {
				return stored;
			}
		}

		if (customCommands) {
			// Try to detect from custom commands
			for (const [managerId] of Object.entries(customCommands)) {
				const manager = managers.find((m) => m.id === managerId);
				if (manager) {
					return manager.id;
				}
			}
		}

		// If no custom commands or no match, detect from package name
		if (packageName) {
			if (packageName.includes("jsr:") || registry === "jsr") {
				const denoManager = managers.find((m) => m.id === "deno");
				if (denoManager) {
					return denoManager.id;
				}
			}

			// Look for package manager specific prefixes
			const npmManager = managers.find((m) => m.id === "npm");
			if (npmManager) {
				return npmManager.id;
			}
		}

		// Default to first available manager if no detection possible
		return managers[0]?.id;
	}, [
		customCommands,
		packageName,
		registry,
		managers,
		storageType,
		storageKey,
	]);

	const [selectedManager, setSelectedManager] = useState(
		detectInitialManager(),
	);

	// Update storage when selection changes
	useEffect(() => {
		if (storageType !== "none") {
			const storage = storageType === "local" ? localStorage : sessionStorage;
			storage.setItem(storageKey, selectedManager);
		}
	}, [selectedManager, storageType, storageKey]);

	useEffect(() => {
		const root = document.documentElement;
		if (theme === "system") {
			root.removeAttribute("data-theme");
		} else {
			root.setAttribute("data-theme", theme);
		}
	}, [theme]);

	// Update selected manager when relevant props change
	useEffect(() => {
		setSelectedManager(detectInitialManager());
	}, [detectInitialManager]);

	const mergedSlots = { ...defaultSlots, ...slots };
	const {
		root: Root,
		navigation: Navigation,
		tab: Tab,
		commandContainer: CommandContainer,
		commandPrefix: CommandPrefix,
		commandText: CommandText,
		copyButton: CopyButton,
	} = mergedSlots;

	const getCommand = (managerId: string) => {
		if (customCommands?.[managerId]) {
			return customCommands[managerId];
		}

		const manager = managers.find((m) => m.id === managerId);
		if (manager?.getCommand) {
			return manager.getCommand(packageName, {
				isDev,
				isPeer,
				isOptional,
				isGlobal,
				useShorthand,
				version,
				tag,
				registry,
			});
		}

		return "";
	};

	const handleTabChange = (managerId: string) => {
		setSelectedManager(managerId);
		const manager = managers.find((m) => m.id === managerId);
		if (onTabChange && manager) {
			onTabChange(managerId, manager);
		}
	};

	const handleCopy = () => {
		const command = getCommand(selectedManager);
		navigator.clipboard.writeText(command);
		const manager = managers.find((m) => m.id === selectedManager);
		if (onCopy && manager) {
			onCopy(command, manager);
		}
	};

	if (managers.length === 0) {
		return null;
	}

	const currentCommand = getCommand(selectedManager);

	return (
		<Root className={classNameFn("install-block", slotClassNames.root || "")}>
			<Navigation
				className={classNameFn(
					"install-block-nav",
					slotClassNames.navigation || "",
				)}
			>
				{managers.map((manager) => (
					<Tab
						key={manager.id}
						isSelected={selectedManager === manager.id}
						onClick={() => handleTabChange(manager.id)}
						className={classNameFn(
							"install-block-tab",
							slotClassNames.tab || "",
						)}
						slotClassNames={slotClassNames}
					>
						{manager.icon()}
						<span>{manager.name}</span>
					</Tab>
				))}
			</Navigation>

			<CommandContainer
				className={classNameFn(
					"install-block-content",
					slotClassNames.commandContainer || "",
				)}
			>
				<div
					className={cn(
						"install-block-group",
						slotClassNames.commandGroup || "",
					)}
				>
					<CommandPrefix
						className={classNameFn(
							"install-block-prefix",
							slotClassNames.commandPrefix || "",
						)}
					>
						{commandPrefix}
					</CommandPrefix>
					<CommandText
						className={classNameFn(
							"install-block-text",
							slotClassNames.commandText || "",
						)}
						slotClassNames={slotClassNames}
					>
						{currentCommand}
					</CommandText>
				</div>
				<CopyButton
					className={classNameFn(
						"install-block-copy",
						slotClassNames.copyButton || "",
					)}
					onClick={handleCopy}
				>
					{React.cloneElement(copyIcon() as React.ReactElement<IconProps>, {
						className: cn(
							copyIcon().props.className,
							slotClassNames.copyButtonIcon || "",
						),
					})}
				</CopyButton>
			</CommandContainer>
		</Root>
	);
};

export default InstallCommand;
