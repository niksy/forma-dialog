import Component from './lib/index.svelte';

export default (options = {}) => {
	const {
		content = new TypeError('Content is not defined.'),
		htmlClassNamespace = '',
		onCreate = () => {},
		onDestroy = () => {},
		onShow = () => {},
		onClose = () => {},
		explicitClose = false
	} = options;

	if (content instanceof TypeError) {
		throw content;
	}

	const instance = new Component({
		target: document.body,
		data: {
			content,
			htmlClassNamespace,
			onCreate,
			onDestroy,
			onShow,
			onClose,
			explicitClose
		}
	});

	return {
		show: () => {
			instance.show();
		},
		close: () => {
			instance.close();
		},
		destroy: () => {
			instance.destroy();
		}
	};
};
