import { Component, createSignal, onMount, Show } from 'solid-js';
import browser from 'webextension-polyfill';
import { runScriptStringWithLogging, ScriptResult } from '../../common/script';

const JSPage: Component = () => {
	const [jsCode, setJsCode] = createSignal('');
	const [isLoading, setIsLoading] = createSignal(false);
	const [result, setResult] = createSignal<ScriptResult | null>(null);

	const loadFromClipboard = async () => {
		try {
			const text = await navigator.clipboard.readText();
			setJsCode(text);
		} catch (err) {
			console.error('Failed to read clipboard:', err);
		}
	};

	const executeScript = async () => {
		if (!jsCode().trim()) return;

		setIsLoading(true);
		try {
			const [tab] = await browser.tabs.query({
				active: true,
				currentWindow: true,
			});
			if (!tab.id) return;

			const scriptResult = await runScriptStringWithLogging(
				tab.id,
				jsCode()
			);
			setResult(scriptResult);
		} catch (error) {
			setResult({
				result: null,
				logs: [],
				errors: [
					error instanceof Error ? error.message : 'Unknown error',
				],
			});
		} finally {
			setIsLoading(false);
		}
	};

	const clearResult = () => {
		setResult(null);
	};

	onMount(async () => {
		//Copy from the clipboard
		const v = await navigator.clipboard.readText();
		if (v) {
			setJsCode(v);
		}
	});

	return (
		<div class="js-page">
			<div class="field">
				<label class="label is-small">JavaScript Code</label>
				<div class="control">
					<textarea
						class="textarea is-code"
						rows={4}
						placeholder="Enter JavaScript code..."
						value={jsCode()}
						onInput={(e) => setJsCode(e.target.value)}
					/>
				</div>
			</div>

			<div class="field is-grouped">
				<div class="control">
					<button
						class="button is-primary is-small"
						onClick={executeScript}
						disabled={isLoading() || !jsCode().trim()}
					>
						{isLoading() ? 'Executing...' : 'Execute'}
					</button>
				</div>
				<div class="control">
					<button
						class="button is-info is-small"
						onClick={loadFromClipboard}
					>
						=� Paste
					</button>
				</div>
				<Show when={result()}>
					<div class="control">
						<button
							class="button is-light is-small"
							onClick={clearResult}
						>
							Clear
						</button>
					</div>
				</Show>
			</div>

			<Show when={result()}>
				<div class="result-section">
					<Show when={result()!.logs.length > 0}>
						<div class="field">
							<label class="label is-small">Console Logs</label>
							<div class="control">
								<textarea
									class="textarea is-small is-info"
									rows={3}
									readonly
									value={result()!.logs.join('\n')}
								/>
							</div>
						</div>
					</Show>

					<Show when={result()!.errors.length > 0}>
						<div class="field">
							<label class="label is-small">Errors</label>
							<div class="control">
								<textarea
									class="textarea is-small is-danger"
									rows={2}
									readonly
									value={result()!.errors.join('\n')}
								/>
							</div>
						</div>
					</Show>

					<Show
						when={
							result()!.result !== null &&
							result()!.result !== undefined
						}
					>
						<div class="field">
							<label class="label is-small">Result</label>
							<div class="control">
								<textarea
									class="textarea is-small is-success"
									rows={2}
									readonly
									value={
										typeof result()!.result === 'object'
											? JSON.stringify(
													result()!.result,
													null,
													2
												)
											: String(result()!.result)
									}
								/>
							</div>
						</div>
					</Show>
				</div>
			</Show>
		</div>
	);
};

export default JSPage;
