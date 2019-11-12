import simulant from 'simulant';
import { KEY_ESCAPE } from 'keycode-js';

function pressEscape(element) {
	simulant.fire(element, 'keydown', { which: KEY_ESCAPE });
}

function mouseClick(element) {
	simulant.fire(element, 'click', { button: 1 });
}

function nodesExist(selectors) {
	return selectors
		.map((selector) => {
			if (Array.isArray(selector)) {
				const node = document.querySelector(selector[0]);
				return selector[1](node);
			}
			return document.querySelector(selector);
		})
		.every(Boolean);
}

export { pressEscape, nodesExist, mouseClick };
