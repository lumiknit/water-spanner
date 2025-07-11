import { render } from 'solid-js/web';
import PopUp from './PopUp';

import './index.scss';

const root = document.getElementById('root');
render(() => <PopUp />, root!);
