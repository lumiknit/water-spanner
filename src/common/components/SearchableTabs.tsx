import { Component, createSignal, For, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export interface TabItem {
	id: string;
	label: string;
	icon?: string;
	content: Component;
}

interface SearchableTabsProps {
	tabs: TabItem[];
	tab: string;
	onTab: (tabId: string) => void;
}

const SearchableTabs: Component<SearchableTabsProps> = (props) => {
	const [searchTerm, setSearchTerm] = createSignal('');

	const filteredTabs = () => {
		if (!searchTerm()) return props.tabs;
		return props.tabs.filter((tab) =>
			tab.label.toLowerCase().includes(searchTerm().toLowerCase())
		);
	};

	const activeTabContent = () => {
		return props.tabs.find((tab) => tab.id === props.tab)?.content;
	};

	return (
		<div class="tabs-container">
			<div class="field mb-3">
				<div class="control has-icons-left">
					<input
						class="input is-small"
						type="text"
						placeholder="Search tabs..."
						value={searchTerm()}
						onInput={(e) => setSearchTerm(e.target.value)}
					/>
					<span class="icon is-small is-left">
						<i class="fas fa-search"></i>
					</span>
				</div>
			</div>

			<div class="tabs is-small">
				<ul>
					<For each={filteredTabs()}>
						{(tab) => (
							<li class={props.tab === tab.id ? 'is-active' : ''}>
								<a onClick={() => props.onTab(tab.id)}>
									<Show when={tab.icon}>
										<span class="icon is-small">
											{tab.icon}
										</span>
									</Show>
									<span>{tab.label}</span>
								</a>
							</li>
						)}
					</For>
				</ul>
			</div>

			<div class="tab-content">
				<Show
					when={activeTabContent()}
					fallback={<div>Select a tab</div>}
				>
					<Dynamic component={activeTabContent()} />
				</Show>
			</div>
		</div>
	);
};

export default SearchableTabs;
