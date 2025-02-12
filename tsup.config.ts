import childProcess from "node:child_process";
import fs from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { type Options, defineConfig } from "tsup";

const common: Options = {
	entry: ["src/index.ts", "src/styles.css"],
	treeshake: false,
	sourcemap: "inline",
	minify: true,
	clean: true,
	dts: true,
	splitting: false,
	format: ["cjs", "esm"],
	external: ["react"],
	injectStyle: false,
};

const getPackageName = async () => {
	try {
		const packageJson = JSON.parse(
			await readFile(path.join(__dirname, "package.json"), "utf-8"),
		);
		return packageJson.name;
	} catch (_error) {
		return "package-name";
	}
};
const _addUseStatement = async (
	pathOrFile: string,
	type: "server" | "client",
	isFile?: boolean,
) => {
	const fullPath = path.join(__dirname, pathOrFile);

	// Use provided isFile parameter if available, otherwise detect from extension
	const shouldHandleAsFile =
		isFile ?? (fullPath.endsWith(".js") || fullPath.endsWith(".mjs"));

	if (shouldHandleAsFile) {
		// Try both .js and .mjs if no extension is provided
		const possiblePaths =
			fullPath.endsWith(".js") || fullPath.endsWith(".mjs")
				? [fullPath]
				: [`${fullPath}.js`, `${fullPath}.mjs`];

		for (const filePath of possiblePaths) {
			if (fs.existsSync(filePath)) {
				let content = await readFile(filePath, "utf-8");
				content = `"use ${type}";\n${content}`;
				fs.writeFileSync(filePath, content, "utf-8");
			}
		}
		return;
	}

	// Handle directory case
	if (!fs.existsSync(fullPath)) {
		throw new Error(`Directory not found: ${fullPath}`);
	}

	const files = fs.readdirSync(fullPath);
	for (const file of files) {
		if (file.endsWith(".js") || file.endsWith(".mjs")) {
			const filePath = path.join(fullPath, file);
			let content = await readFile(filePath, "utf-8");
			content = `"use ${type}";\n${content}`;
			fs.writeFileSync(filePath, content, "utf-8");
		}
	}
};

const linkSelf = async () => {
	await new Promise((resolve) => {
		childProcess.exec("pnpm link:self", (error, _stdout, _stderr) => {
			if (error) {
				// biome-ignore lint/suspicious/noConsole: <explanation>
				console.error(`exec error: ${error}`);
				return;
			}

			resolve(undefined);
		});
	});

	// biome-ignore lint/suspicious/noConsoleLog: <explanation>
	// biome-ignore lint/suspicious/noConsole: <explanation>
	console.log(
		`Run 'pnpm link ${await getPackageName()} --global' inside another project to consume this package.`,
	);
};

export default defineConfig({
	async onSuccess() {
		// If you want need to add a use statement to files, you can use the following code:
		await _addUseStatement("dist/index", "client", true);

		await linkSelf();
	},
	...common,
});
