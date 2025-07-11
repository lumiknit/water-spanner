import { Component, createSignal, Show } from 'solid-js';
import browser from 'webextension-polyfill';
import { runScriptWithLogging } from '../../common/script';

interface ElementInfo {
	tagName: string;
	id: string;
	className: string;
	xpath: string;
	cssSelector: string;
	textContent: string;
	attributes: Record<string, string>;
}

const InspectorPage: Component = () => {
	const [isInspecting, setIsInspecting] = createSignal(false);
	const [elementInfo, setElementInfo] = createSignal<ElementInfo | null>(
		null
	);
	const [message, setMessage] = createSignal('');

	const startInspection = async () => {
		setIsInspecting(true);
		setMessage('Click on any element in the page to inspect it');

		try {
			const [tab] = await browser.tabs.query({
				active: true,
				currentWindow: true,
			});
			if (!tab.id) return;

			const inspectorScript = () => {
				return new Promise((resolve) => {
					const getXPath = (element: Element): string => {
						if (element.id) {
							return `//*[@id="${element.id}"]`;
						}

						let path = '';
						let current = element;

						while (
							current &&
							current.nodeType === Node.ELEMENT_NODE
						) {
							let selector = current.tagName.toLowerCase();

							if (current.className) {
								selector +=
									'.' +
									current.className.split(' ').join('.');
							}

							const siblings = Array.from(
								current.parentNode?.children || []
							);
							const sameTagSiblings = siblings.filter(
								(el) => el.tagName === current.tagName
							);

							if (sameTagSiblings.length > 1) {
								const index =
									sameTagSiblings.indexOf(current) + 1;
								selector += `[${index}]`;
							}

							path = selector + (path ? '/' + path : '');
							current = current.parentElement as Element;
						}

						return '//' + path;
					};

					const getCSSSelector = (element: Element): string => {
						if (element.id) {
							return `#${element.id}`;
						}

						let path = '';
						let current = element;

						while (
							current &&
							current.nodeType === Node.ELEMENT_NODE
						) {
							let selector = current.tagName.toLowerCase();

							if (current.className) {
								const classes = current.className
									.split(' ')
									.filter((c) => c.trim());
								if (classes.length > 0) {
									selector += '.' + classes.join('.');
								}
							}

							path = selector + (path ? ' > ' + path : '');
							current = current.parentElement as Element;
						}

						return path;
					};

					const handleClick = (event: MouseEvent) => {
						event.preventDefault();
						event.stopPropagation();

						const element = event.target as Element;

						const info: ElementInfo = {
							tagName: element.tagName,
							id: element.id || '',
							className: element.className || '',
							xpath: getXPath(element),
							cssSelector: getCSSSelector(element),
							textContent:
								element.textContent?.slice(0, 200) || '',
							attributes: {},
						};

						Array.from(element.attributes).forEach((attr) => {
							info.attributes[attr.name] = attr.value;
						});

						document.removeEventListener('click', handleClick);
						document.body.style.cursor = 'auto';

						resolve(info);
					};

					document.addEventListener('click', handleClick);
					document.body.style.cursor = 'crosshair';
				});
			};

			const result = await runScriptWithLogging(tab.id, inspectorScript);
			setElementInfo(result.result);
			setMessage('Element inspected successfully!');
		} catch (error) {
			setMessage(
				`Error: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		} finally {
			setIsInspecting(false);
			setTimeout(() => setMessage(''), 5000);
		}
	};

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setMessage('Copied to clipboard!');
			setTimeout(() => setMessage(''), 2000);
		} catch (err) {
			console.error('Failed to copy to clipboard:', err);
		}
	};

	const clearInfo = () => {
		setElementInfo(null);
		setMessage('');
	};

	return (
		<div class="inspector-page">
			<div class="field">
				<div class="control">
					<button
						class="button is-primary is-small"
						onClick={startInspection}
						disabled={isInspecting()}
					>
						{isInspecting()
							? 'Inspecting...'
							: '🔍 Start Inspection'}
					</button>
					<Show when={elementInfo()}>
						<button
							class="button is-light is-small ml-2"
							onClick={clearInfo}
						>
							Clear
						</button>
					</Show>
				</div>
			</div>

			<Show when={message()}>
				<div
					class={`notification is-small ${message().includes('Error') ? 'is-danger' : 'is-info'}`}
				>
					{message()}
				</div>
			</Show>

			<Show when={elementInfo()}>
				<div class="element-info">
					<div class="field">
						<label class="label is-small">Tag Name</label>
						<div class="control">
							<input
								class="input is-small"
								readonly
								value={elementInfo()!.tagName}
							/>
						</div>
					</div>

					<Show when={elementInfo()!.id}>
						<div class="field">
							<label class="label is-small">ID</label>
							<div class="control">
								<div class="field has-addons">
									<div class="control is-expanded">
										<input
											class="input is-small"
											readonly
											value={elementInfo()!.id}
										/>
									</div>
									<div class="control">
										<button
											class="button is-small"
											onClick={() =>
												copyToClipboard(
													elementInfo()!.id
												)
											}
										>
											📋
										</button>
									</div>
								</div>
							</div>
						</div>
					</Show>

					<Show when={elementInfo()!.className}>
						<div class="field">
							<label class="label is-small">Class Name</label>
							<div class="control">
								<div class="field has-addons">
									<div class="control is-expanded">
										<input
											class="input is-small"
											readonly
											value={elementInfo()!.className}
										/>
									</div>
									<div class="control">
										<button
											class="button is-small"
											onClick={() =>
												copyToClipboard(
													elementInfo()!.className
												)
											}
										>
											📋
										</button>
									</div>
								</div>
							</div>
						</div>
					</Show>

					<div class="field">
						<label class="label is-small">XPath</label>
						<div class="control">
							<div class="field has-addons">
								<div class="control is-expanded">
									<textarea
										class="textarea is-small"
										rows={2}
										readonly
										value={elementInfo()!.xpath}
									/>
								</div>
								<div class="control">
									<button
										class="button is-small"
										onClick={() =>
											copyToClipboard(
												elementInfo()!.xpath
											)
										}
									>
										📋
									</button>
								</div>
							</div>
						</div>
					</div>

					<div class="field">
						<label class="label is-small">CSS Selector</label>
						<div class="control">
							<div class="field has-addons">
								<div class="control is-expanded">
									<textarea
										class="textarea is-small"
										rows={2}
										readonly
										value={elementInfo()!.cssSelector}
									/>
								</div>
								<div class="control">
									<button
										class="button is-small"
										onClick={() =>
											copyToClipboard(
												elementInfo()!.cssSelector
											)
										}
									>
										📋
									</button>
								</div>
							</div>
						</div>
					</div>

					<Show when={elementInfo()!.textContent}>
						<div class="field">
							<label class="label is-small">Text Content</label>
							<div class="control">
								<textarea
									class="textarea is-small"
									rows={2}
									readonly
									value={elementInfo()!.textContent}
								/>
							</div>
						</div>
					</Show>
				</div>
			</Show>
		</div>
	);
};

export default InspectorPage;
