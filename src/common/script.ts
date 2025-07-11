import browser from 'webextension-polyfill';

export const maniVer = browser.runtime.getManifest().manifest_version;

export interface ScriptResult {
	result: any;
	logs: string[];
	errors: string[];
}

const indirectEval = (code: string, args: any[]): any => {
	window.f = Function;
	console.log('Logging start');
	return new window.f(code);
};

// Enhanced script execution that captures console.log and errors
export const runScriptWithLogging = async (
	tabID: number,
	func: (...args: any[]) => any,
	args: any[] = []
): Promise<ScriptResult> => {
	const wrappedFunction = `
		(function() {
			const logs = [];
			const errors = [];
			const originalLog = console.log;
			const originalError = console.error;

			console.log = function(...args) {
				logs.push(args.map(arg =>
					typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
				).join(' '));
				originalLog.apply(console, arguments);
			};

			console.error = function(...args) {
				errors.push(args.map(arg =>
					typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
				).join(' '));
				originalError.apply(console, arguments);
			};

			try {
				const result = (${func.toString()})(${args
					.map((arg) => JSON.stringify(arg))
					.join(', ')});

				// Restore original console methods
				console.log = originalLog;
				console.error = originalError;

				return { result, logs, errors };
			} catch (error) {
				console.log = originalLog;
				console.error = originalError;
				errors.push(error.message);
				return { result: null, logs, errors };
			}
		})()
	`;

	if (maniVer === 2) {
		return (
			await browser.tabs.executeScript(tabID, {
				code: wrappedFunction,
			})
		)[0];
	} else if (maniVer >= 3) {
		await browser.scripting.executeScript({
			target: { tabId: tabID },
			files: ['/src/common/e.js'],
		});
		return (
			await browser.scripting.executeScript({
				target: { tabId: tabID },
				func: indirectEval,
				args: [wrappedFunction],
			})
		)[0].result;
	}

	return { result: null, logs: [], errors: ['Unsupported manifest version'] };
};

// Enhanced script execution that captures console.log and errors from string code
export const runScriptStringWithLogging = async (
	tabID: number,
	code: string
): Promise<ScriptResult> => {
	const wrappedFunction = `
		(function() {
			const logs = [];
			const errors = [];
			const originalLog = console.log;
			const originalError = console.error;

			console.log = function(...args) {
				logs.push(args.map(arg =>
					typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
				).join(' '));
				originalLog.apply(console, arguments);
			};

			console.error = function(...args) {
				errors.push(args.map(arg =>
					typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
				).join(' '));
				originalError.apply(console, arguments);
			};

			try {
				const result = (function() {
					${code}
				})();

				// Restore original console methods
				console.log = originalLog;
				console.error = originalError;

				return { result, logs, errors };
			} catch (error) {
				console.log = originalLog;
				console.error = originalError;
				errors.push(error.message);
				return { result: null, logs, errors };
			}
		})()
	`;

	if (maniVer === 2) {
		return (
			await browser.tabs.executeScript(tabID, {
				code: wrappedFunction,
			})
		)[0];
	} else if (maniVer >= 3) {
		return (
			await browser.scripting.executeScript({
				target: { tabId: tabID },
				func: indirectEval,
				args: [wrappedFunction],
			})
		)[0].result;
	}

	return { result: null, logs: [], errors: ['Unsupported manifest version'] };
};

// CSS injection utility
export const injectCSS = async (tabID: number, css: string): Promise<void> => {
	if (maniVer === 2) {
		await browser.tabs.insertCSS(tabID, { code: css });
	} else if (maniVer >= 3) {
		await browser.scripting.insertCSS({
			target: { tabId: tabID },
			css: css,
		});
	}
};

// Remove injected CSS
export const removeCSS = async (tabID: number, css: string): Promise<void> => {
	if (maniVer === 2) {
		await browser.tabs.removeCSS(tabID, { code: css });
	} else if (maniVer >= 3) {
		await browser.scripting.removeCSS({
			target: { tabId: tabID },
			css: css,
		});
	}
};
