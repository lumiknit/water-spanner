import { Component, createSignal, Show } from 'solid-js';
import browser from 'webextension-polyfill';
import { injectCSS, removeCSS } from '../../common/script';

const CSSPage: Component = () => {
	const [cssCode, setCssCode] = createSignal('');
	const [isLoading, setIsLoading] = createSignal(false);
	const [injectedCSS, setInjectedCSS] = createSignal<string | null>(null);
	const [message, setMessage] = createSignal('');

	const loadFromClipboard = async () => {
		try {
			const text = await navigator.clipboard.readText();
			setCssCode(text);
		} catch (err) {
			console.error('Failed to read clipboard:', err);
		}
	};

	const injectCSSCode = async () => {
		if (!cssCode().trim()) return;

		setIsLoading(true);
		try {
			const [tab] = await browser.tabs.query({
				active: true,
				currentWindow: true,
			});
			if (!tab.id) return;

			await injectCSS(tab.id, cssCode());
			setInjectedCSS(cssCode());
			setMessage('CSS injected successfully!');
			setTimeout(() => setMessage(''), 3000);
		} catch (error) {
			setMessage(
				`Error: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
			setTimeout(() => setMessage(''), 5000);
		} finally {
			setIsLoading(false);
		}
	};

	const removeCSSCode = async () => {
		if (!injectedCSS()) return;

		setIsLoading(true);
		try {
			const [tab] = await browser.tabs.query({
				active: true,
				currentWindow: true,
			});
			if (!tab.id) return;

			await removeCSS(tab.id, injectedCSS()!);
			setInjectedCSS(null);
			setMessage('CSS removed successfully!');
			setTimeout(() => setMessage(''), 3000);
		} catch (error) {
			setMessage(
				`Error: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
			setTimeout(() => setMessage(''), 5000);
		} finally {
			setIsLoading(false);
		}
	};

	const clearCode = () => {
		setCssCode('');
		setMessage('');
	};

	return (
		<div class="css-page">
			<div class="field">
				<label class="label is-small">CSS Code</label>
				<div class="control">
					<textarea
						class="textarea is-code"
						rows={6}
						placeholder="Enter CSS code..."
						value={cssCode()}
						onInput={(e) => setCssCode(e.target.value)}
					/>
				</div>
			</div>

			<div class="field is-grouped">
				<div class="control">
					<button
						class="button is-primary is-small"
						onClick={injectCSSCode}
						disabled={isLoading() || !cssCode().trim()}
					>
						{isLoading() ? 'Injecting...' : 'Inject CSS'}
					</button>
				</div>
				<div class="control">
					<button
						class="button is-info is-small"
						onClick={loadFromClipboard}
					>
						📋 Paste
					</button>
				</div>
				<Show when={injectedCSS()}>
					<div class="control">
						<button
							class="button is-warning is-small"
							onClick={removeCSSCode}
							disabled={isLoading()}
						>
							{isLoading() ? 'Removing...' : 'Remove CSS'}
						</button>
					</div>
				</Show>
				<div class="control">
					<button
						class="button is-light is-small"
						onClick={clearCode}
					>
						Clear
					</button>
				</div>
			</div>

			<Show when={message()}>
				<div
					class={`notification is-small ${message().includes('Error') ? 'is-danger' : 'is-success'}`}
				>
					{message()}
				</div>
			</Show>

			<Show when={injectedCSS()}>
				<div class="field">
					<label class="label is-small">Currently Injected CSS</label>
					<div class="control">
						<textarea
							class="textarea is-small is-info"
							rows={4}
							readonly
							value={injectedCSS() || ''}
						/>
					</div>
				</div>
			</Show>

			<div class="field">
				<label class="label is-small">Quick Examples</label>
				<div class="buttons are-small">
					<button
						class="button is-light is-small"
						onClick={() =>
							setCssCode('body { background-color: #f0f0f0; }')
						}
					>
						Gray Background
					</button>
					<button
						class="button is-light is-small"
						onClick={() =>
							setCssCode('* { outline: 1px solid red; }')
						}
					>
						Debug Outline
					</button>
					<button
						class="button is-light is-small"
						onClick={() =>
							setCssCode('img { filter: grayscale(100%); }')
						}
					>
						Grayscale Images
					</button>
				</div>
			</div>
		</div>
	);
};

export default CSSPage;
