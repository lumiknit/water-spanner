import { Component, createSignal } from 'solid-js';
import NavBar, { NavItem } from '../common/components/NavBar';

const App: Component = () => {
	const [activeSection, setActiveSection] = createSignal('general');

	const navItems: NavItem[] = [
		{ id: 'general', label: 'General', icon: '⚙️' },
		{ id: 'scripts', label: 'Scripts', icon: '⚡' },
		{ id: 'styles', label: 'Styles', icon: '🎨' },
		{ id: 'about', label: 'About', icon: 'ℹ️' },
	];

	const renderContent = () => {
		switch (activeSection()) {
			case 'general':
				return (
					<div class="content">
						<h2 class="title is-4">General Settings</h2>
						<div class="field">
							<label class="label">
								Auto-load clipboard content
							</label>
							<div class="control">
								<label class="checkbox">
									<input type="checkbox" />
									Automatically load clipboard content into
									input fields
								</label>
							</div>
						</div>
						<div class="field">
							<label class="label">Mobile optimization</label>
							<div class="control">
								<label class="checkbox">
									<input type="checkbox" checked />
									Enable mobile-friendly interface
								</label>
							</div>
						</div>
					</div>
				);
			case 'scripts':
				return (
					<div class="content">
						<h2 class="title is-4">JavaScript Settings</h2>
						<div class="field">
							<label class="label">
								Script execution timeout
							</label>
							<div class="control">
								<input
									class="input"
									type="number"
									value="5000"
								/>
								<p class="help">
									Maximum execution time in milliseconds
								</p>
							</div>
						</div>
						<div class="field">
							<label class="label">Console logging</label>
							<div class="control">
								<label class="checkbox">
									<input type="checkbox" checked />
									Capture console.log output
								</label>
							</div>
						</div>
					</div>
				);
			case 'styles':
				return (
					<div class="content">
						<h2 class="title is-4">CSS Settings</h2>
						<div class="field">
							<label class="label">CSS injection mode</label>
							<div class="control">
								<div class="select">
									<select>
										<option>
											Temporary (removed on page reload)
										</option>
										<option>
											Persistent (stays until removed)
										</option>
									</select>
								</div>
							</div>
						</div>
						<div class="field">
							<label class="label">Default CSS templates</label>
							<div class="control">
								<label class="checkbox">
									<input type="checkbox" checked />
									Show quick CSS examples
								</label>
							</div>
						</div>
					</div>
				);
			case 'about':
				return (
					<div class="content">
						<h2 class="title is-4">About Water Spanner</h2>
						<p>
							Multi-purpose web extension for developers and power
							users.
						</p>
						<h3 class="title is-5">Features</h3>
						<ul>
							<li>Execute JavaScript code in web pages</li>
							<li>Inject custom CSS styles</li>
							<li>Inspect DOM elements</li>
							<li>Mobile-friendly interface</li>
							<li>Cross-browser compatibility</li>
						</ul>
						<h3 class="title is-5">Version</h3>
						<p>1.0.0</p>
					</div>
				);
			default:
				return <div>Unknown section</div>;
		}
	};

	return (
		<div class="options-app">
			<NavBar
				items={navItems}
				activeItem={activeSection()}
				onItemClick={setActiveSection}
			/>
			<div class="container">
				<div class="section">{renderContent()}</div>
			</div>
		</div>
	);
};

export default App;
