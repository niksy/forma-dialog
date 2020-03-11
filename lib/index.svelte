<script>
import focusLock from 'dom-focus-lock';
import { KEY_ESCAPE } from 'keycode-js';
import delegate from 'delegate-event-listener';
import ancestors from 'ancestors';
import siblings from 'dom-siblings';

let dialogInstanceStack = [];
let dialogReferenceStack = [];
let count = 0;

/**
 * @param  {HTMLElement}  rootNode
 * @param  {boolean} isHidden
 */
function markRelatedNodesAsHidden(rootNode, isHidden) {
	[rootNode]
		.concat(ancestors(rootNode))
		.filter(
			(node) =>
				node !== document.body && node !== document.documentElement
		)
		.map((node) => siblings(node))
		.reduce((array, nodes) => array.concat(nodes), [])
		.forEach((node) => {
			markNodeAsHidden(node, isHidden);
		});
}

/**
 * @param  {HTMLElement}  node
 * @param  {boolean} isHidden
 */
function markNodeAsHidden(node, isHidden) {
	if (isHidden) {
		node.setAttribute('aria-hidden', 'true');
	} else {
		node.removeAttribute('aria-hidden');
	}
}

/**
 * @param  {number}  keycode
 *
 * @returns {boolean}
 */
function isMouseClick(keycode) {
	return keycode >= 1 && keycode <= 3;
}

/**
 * @param  {string[]} namespaces
 * @param  {string} suffix
 *
 * @returns {string}
 */
function createHtmlClass(namespaces, suffix) {
	return namespaces
		.filter(
			(namespace) =>
				(typeof namespace === 'undefined' ? '' : namespace) !== ''
		)
		.map((namespace) => `${namespace}${suffix}`)
		.join(' ');
}

export default {
	oncreate() {
		const { id, isContentNode, content, onCreate } = this.get();
		dialogReferenceStack.push([id, this.refs.container]);
		if (isContentNode) {
			this.refs.dialog.appendChild(content);
		}
		onCreate();
	},
	ondestroy() {
		const { id, onDestroy, isComponentActive } = this.get();
		if (!isComponentActive) {
			return;
		}
		dialogReferenceStack = dialogReferenceStack.filter(
			([stackId]) => stackId !== id
		);
		this.unlockFocus();
		this.set({ isHidden: true });
		onDestroy();
		this.set({ isComponentActive: false });
	},
	data() {
		const id = count;
		count = count + 1;
		return {
			isComponentActive: true,
			internalHtmlClassNamespace: 'statua-Dialog',
			isHidden: true,
			id: id
		};
	},
	computed: {
		classNames({ internalHtmlClassNamespace, htmlClassNamespace }) {
			return {
				container: createHtmlClass(
					[internalHtmlClassNamespace, htmlClassNamespace],
					''
				),
				content: createHtmlClass(
					[internalHtmlClassNamespace, htmlClassNamespace],
					'-content'
				),
				backdrop: createHtmlClass(
					[internalHtmlClassNamespace, htmlClassNamespace],
					'-backdrop'
				)
			};
		},
		isContentNode: ({ content }) => content instanceof Node
	},
	events: {
		clickactionclose(node, callback) {
			const handler = delegate(
				'[data-statua-dialog-action="close"]',
				callback
			);
			node.addEventListener('click', handler, false);
			return {
				destroy() {
					node.removeEventListener('click', handler, false);
				}
			};
		}
	},
	methods: {
		handleGlobalMouseEvent(event) {
			const keycode = event.which;
			const target = event.target;
			const { isHidden } = this.get();
			const { explicitClose } = this.get();
			if (
				!isHidden &&
				!explicitClose &&
				isMouseClick(keycode) &&
				target !== this.refs.dialog &&
				!this.refs.dialog.contains(target) &&
				(target === this.refs.backdrop ||
					this.refs.backdrop.contains(target))
			) {
				this.close();
			}
		},
		handleGlobalKeyboardEvent(event) {
			const keycode = event.which;
			const { explicitClose } = this.get();
			if (
				!explicitClose &&
				keycode === KEY_ESCAPE &&
				dialogInstanceStack.length !== 0
			) {
				const { id } = this.get();
				const [stackId] = dialogInstanceStack[
					dialogInstanceStack.length - 1
				];
				if (stackId === id) {
					this.close();
				}
			}
		},
		show() {
			const { onShow, isComponentActive } = this.get();
			if (!isComponentActive) {
				return;
			}
			this.set({ isHidden: false });
			this.lockFocus();
			onShow();
		},
		close() {
			const { onClose, isComponentActive } = this.get();
			if (!isComponentActive) {
				return;
			}
			this.unlockFocus();
			this.set({ isHidden: true });
			onClose();
		},
		lockFocus() {
			const { id, isHidden } = this.get();
			if (isHidden) {
				return;
			}
			focusLock.on(this.refs.dialog);

			dialogInstanceStack.forEach(([, instance]) => {
				markRelatedNodesAsHidden(instance.refs.container, false);
			});
			dialogInstanceStack = dialogInstanceStack.filter(
				([stackId]) => stackId !== id
			);

			dialogInstanceStack.push([id, this]);
			markRelatedNodesAsHidden(this.refs.container, true);
		},
		unlockFocus() {
			const { id, isHidden } = this.get();
			if (isHidden) {
				return;
			}
			focusLock.off(this.refs.dialog);

			const activeElement = document.activeElement;

			dialogInstanceStack = dialogInstanceStack.filter(
				([stackId]) => stackId !== id
			);
			dialogInstanceStack.forEach(([, instance]) => {
				markRelatedNodesAsHidden(instance.refs.container, false);
			});
			markRelatedNodesAsHidden(this.refs.container, false);

			if (
				activeElement === document.body &&
				dialogInstanceStack.length !== 0
			) {
				const [, instance] = dialogInstanceStack[
					dialogInstanceStack.length - 1
				];
				markRelatedNodesAsHidden(instance.refs.container, true);
			} else {
				dialogInstanceStack.forEach(([, instance]) => {
					if (
						instance.refs.container.contains(activeElement) ||
						instance.refs.container === activeElement
					) {
						markRelatedNodesAsHidden(instance.refs.container, true);
					}
				});
			}
			if (dialogInstanceStack.length === 0) {
				dialogReferenceStack.forEach(([, node]) => {
					markNodeAsHidden(node, true);
				});
			}
		}
	}
};
</script>

<style>
	[data-statua-dialog-focus-guard][tabindex] {
		width: 1px;
		height: 0px;
		padding: 0px;
		overflow: hidden;
		position: fixed;
		top: 0px;
		left: 0px;
	}
</style>

<svelte:document
	on:click="handleGlobalMouseEvent(event)"
	on:keydown="handleGlobalKeyboardEvent(event)"
/>
<div class="{classNames.container}" ref:container class:is-hidden="isHidden">
	<div data-statua-dialog-focus-guard="true" tabindex="0"></div>
	<div data-statua-dialog-focus-guard="true" tabindex="1"></div>
	<div class="{classNames.backdrop}" ref:backdrop>
		<div
			class="{classNames.content}"
			role="dialog"
			aria-modal="true"
			ref:dialog
			on:clickactionclose="close()"
			tabindex="-1"
		>
			{#if !isContentNode} {@html content} {/if}
		</div>
	</div>
	<div data-statua-dialog-focus-guard="true" tabindex="0"></div>
</div>
