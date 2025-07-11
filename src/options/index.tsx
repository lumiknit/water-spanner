import { render } from 'solid-js/web';
import App from './App';

import '../common/index.scss';

const root = document.getElementById('root');
render(() => <App />, root!);
