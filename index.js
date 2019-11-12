import Component from './lib/index.svelte';

export default (options = {}) => {
	const {
		content = new TypeError('Content is not defined.'),
		htmlClassNamespace = '',
		onCreate = () => {},
		onDestroy = () => {},
	} = options;

	let instance;

	if (content instanceof TypeError) {
		throw content;
	}

	return {
		show: () => {
			instance = new Component({
				target: document.body,
				data: {
					content,
					htmlClassNamespace,
					onCreate,
					onDestroy
				}
			});
		},
		destroy: () => {
			if (typeof instance === 'undefined') {
				return;
			}
			const { isComponentActive } = instance.get();
			if (isComponentActive === true) {
				instance.set({ isComponentActive: false });
				instance.destroy();
			}
		}
	};
};
