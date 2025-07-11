import { Component, createSignal, For } from 'solid-js';

export type Option = {
	label: string;
	value: string;
};

type Props = {
	options: Option[];
	selected: string;
	onChange: (value: string) => void;
};

const OptionTags: Component<Props> = (props) => {
	const [filter, setFilter] = createSignal('');

	return (
		<div class="option-tags">
			<input
				type="text"
				placeholder="Filter..."
				value={filter()}
				onInput={(e) => setFilter(e.currentTarget.value)}
			/>
			<For each={props.options}>
				{(o) => (
					<button
						class={
							'btn is-small ' +
							(props.selected === o.value ? 'is-primary' : '')
						}
						onClick={() => props.onChange(o.value)}
					>
						{o.label}
					</button>
				)}
			</For>
		</div>
	);
};

export default OptionTags;
