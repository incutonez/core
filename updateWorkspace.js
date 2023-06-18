import { execSync } from "child_process";

const apps = ["api", "shared", "ui", "shared-ts"];
apps.forEach((app) => {
	console.info(`Updating: ${app}`);
	const out = execSync("npx npm-check-updates -u", {
		cwd: app,
	});
	console.info(out.toString());
});
