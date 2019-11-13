<script>
import focusLock from 'dom-focus-lock';
import { KEY_ESCAPE } from 'keycode-js';
import delegate from 'delegate-event-listener';

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

let dialogStack = [];
let count = 0;

export default {
	oncreate() {
		const { isContentNode, content, onCreate, id } = this.get();
		onCreate();
		if (isContentNode) {
			this.refs.dialog.appendChild(content);
		}
		focusLock.on(this.refs.dialog);
		dialogStack.push(id);
	},
	ondestroy() {
		const { onDestroy, id } = this.get();
		onDestroy();
		focusLock.off(this.refs.dialog);
		dialogStack = dialogStack.filter((dialogStackId) => dialogStackId !== id);
	},
	data() {
		const id = count;
		count = count + 1;
		return {
			internalHtmlClassNamespace: 'z-Dialog',
			isComponentActive: true,
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
				'[data-z-dialog-action="close"]',
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
			if (
				isMouseClick(keycode) &&
				target !== this.refs.dialog &&
				!this.refs.dialog.contains(target) &&
				(target === this.refs.backdrop ||
					this.refs.backdrop.contains(target))
			) {
				this.destroy();
			}
		},
		handleGlobalKeyboardEvent(event) {
			const keycode = event.which;
			if (keycode === KEY_ESCAPE) {
				const { id } = this.get();
				const lastDialogStackId = dialogStack[dialogStack.length - 1];
				if (lastDialogStackId === id) {
					this.destroy();
				}
			}
		}
	}
};
</script>

<style>
	[data-z-dialog-focus-guard][tabindex] {
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
<div class="{classNames.container}" ref:container>
	<div data-z-dialog-focus-guard="true" tabindex="0"></div>
	<div data-z-dialog-focus-guard="true" tabindex="1"></div>
	<div class="{classNames.backdrop}" ref:backdrop>
		<div
			class="{classNames.content}"
			role="dialog"
			aria-modal="true"
			ref:dialog
			on:clickactionclose="destroy()"
			tabindex="-1"
		>
			{#if !isContentNode} {@html content} {/if}
		</div>
	</div>
	<div data-z-dialog-focus-guard="true" tabindex="0"></div>
</div>
