import browser from 'webextension-polyfill';
import { Component, createSignal } from 'solid-js';
import SearchableTabs, { TabItem } from '../common/components/SearchableTabs';
import JSPage from './pages/JSPage';
import CSSPage from './pages/CSSPage';
import InspectorPage from './pages/InspectorPage';

const PopUp: Component = () => {
	const tabs: TabItem[] = [
		{
			id: 'js',
			label: 'Run JS',
			icon: '⚡',
			content: JSPage,
		},
		{
			id: 'css',
			label: 'Inject CSS',
			icon: '🎨',
			content: CSSPage,
		},
		{
			id: 'inspector',
			label: 'Inspector',
			icon: '🔍',
			content: InspectorPage,
		},
	];

	const [activeTab, setActiveTab] = createSignal('js');

	const openOptions = async () => {
		await browser.runtime.openOptionsPage();
	};

	return (
		<div class="popup-container">
			<div class="popup-header">
				<h1 class="title is-6">Water Spanner</h1>
				<button class="button is-small is-light" onClick={openOptions}>
					⚙️ Options
				</button>
			</div>

			<SearchableTabs
				tabs={tabs}
				tab={activeTab()}
				onTab={setActiveTab}
			/>
		</div>
	);
};

export default PopUp;
