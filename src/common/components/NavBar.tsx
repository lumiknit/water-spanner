import { Component, For, createSignal } from 'solid-js';

export interface NavItem {
	id: string;
	label: string;
	icon?: string;
}

interface NavBarProps {
	items: NavItem[];
	activeItem: string;
	onItemClick: (itemId: string) => void;
}

const NavBar: Component<NavBarProps> = (props) => {
	const [showMenu, setShowMenu] = createSignal(false);
	return (
		<nav class="navbar" role="navigation" aria-label="main navigation">
			<div class="navbar-brand">
				<span class="navbar-item">
					<strong>W*S</strong>
				</span>

				<a
					role="button"
					class="navbar-burger"
					aria-label="menu"
					aria-expanded="false"
					data-target="navbarMenu"
					onClick={() => setShowMenu(!showMenu())}
				>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
				</a>
			</div>
			<div
				id="navbarMenu"
				class={'navbar-menu' + (showMenu() ? ' is-active' : '')}
			>
				<div class="navbar-start">
					<For each={props.items}>
						{(item) => (
							<a
								class={`navbar-item ${
									props.activeItem === item.id
										? 'is-active'
										: ''
								}`}
								onClick={() => props.onItemClick(item.id)}
							>
								{item.icon && (
									<span class="icon">{item.icon}</span>
								)}
								<span>{item.label}</span>
							</a>
						)}
					</For>
				</div>
			</div>
		</nav>
	);
};

export default NavBar;
