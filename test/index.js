import assert from 'assert';
import sinon from 'sinon';
import { html } from 'domelo';
import fn from '../index';
import { nodesExist, pressEscape, mouseClick } from './util';

before(function() {
	window.fixture.load('/test/fixtures/index.html');
});

after(function() {
	window.fixture.cleanup();
});

it('should create instance with string as content', function() {
	const instance = fn({
		content: /* HTML */ '<div class="becky">becky</div>'
	});
	instance.show();

	assert.ok(nodesExist(['.statua-Dialog-content[role="dialog"] .becky']));

	instance.destroy();
});

it('should create instance with DOM node as content', function() {
	const node = html`
		<div class="archie">archie</div>
	`;
	const instance = fn({
		content: node
	});
	instance.show();

	assert.ok(nodesExist(['.statua-Dialog-content[role="dialog"] .archie']));

	instance.destroy();
});

it('should throw error if content doesn’t exist', function() {
	assert.throws(() => {
		fn();
	}, /TypeError: Content is not defined./);
});

it('should close instance when pressing Escape key', function() {
	const instance = fn({
		content: /* HTML */ `
			<div class="becky">becky</div>
		`
	});
	instance.show();

	try {
		assert.ok(nodesExist(['.statua-Dialog-content[role="dialog"] .becky']));

		pressEscape(document.body);

		assert.ok(
			nodesExist([
				'.statua-Dialog.is-hidden .statua-Dialog-content[role="dialog"] .becky'
			])
		);
	} finally {
		instance.destroy();
	}
});

it('should leave instance open if explicitClose is true and Escape key is pressed', function() {
	const instance = fn({
		content: /* HTML */ `
			<div class="becky">becky</div>
		`,
		explicitClose: true
	});
	instance.show();

	try {
		assert.ok(nodesExist(['.statua-Dialog-content[role="dialog"] .becky']));

		pressEscape(document.body);

		assert.ok(!nodesExist(['.statua-Dialog.is-hidden']));
	} finally {
		instance.destroy();
	}
});

it('should close instance when clicking outside dialog', function() {
	const instance = fn({
		content: /* HTML */ `
			<div class="becky">becky</div>
		`
	});
	instance.show();

	const element = document.querySelector('.statua-Dialog');
	const outsideElement = document.querySelector('.statua-Dialog-backdrop');

	try {
		mouseClick(element);

		assert.ok(nodesExist(['.statua-Dialog-content[role="dialog"] .becky']));

		mouseClick(outsideElement);

		assert.ok(
			nodesExist([
				'.statua-Dialog.is-hidden .statua-Dialog-content[role="dialog"] .becky'
			])
		);
	} finally {
		instance.destroy();
	}
});

it('should leave instance open when clicking outside dialog if explicitClose is true', function() {
	const instance = fn({
		content: /* HTML */ `
			<div class="becky">becky</div>
		`,
		explicitClose: true
	});
	instance.show();

	const element = document.querySelector('.statua-Dialog');
	const outsideElement = document.querySelector('.statua-Dialog-backdrop');

	try {
		mouseClick(element);

		assert.ok(nodesExist(['.statua-Dialog-content[role="dialog"] .becky']));

		mouseClick(outsideElement);

		assert.ok(!nodesExist(['.statua-Dialog.is-hidden']));
	} finally {
		instance.destroy();
	}
});

it('should close instance when clicking on [data-statua-dialog-action="close"]', function() {
	const instance = fn({
		content: /* HTML */ `
			<div class="becky">
				<button type="button" class="molly">molly</button>
				<button
					type="button"
					class="honey"
					data-statua-dialog-action="close"
				>
					honey
				</button>
			</div>
		`
	});
	instance.show();

	const element = document.querySelector('.statua-Dialog');
	const genericButton = document.querySelector('.molly');
	const closeButton = document.querySelector('.honey');

	try {
		mouseClick(genericButton);

		assert.ok(nodesExist(['.statua-Dialog-content[role="dialog"] .becky']));

		mouseClick(closeButton);

		assert.ok(
			nodesExist([
				'.statua-Dialog.is-hidden .statua-Dialog-content[role="dialog"] .becky'
			])
		);
	} finally {
		instance.destroy();
	}
});

it('should call lifecycle methods', function() {
	const createSpy = sinon.spy();
	const destroySpy = sinon.spy();
	const showSpy = sinon.spy();
	const closeSpy = sinon.spy();

	const instance = fn({
		content: /* HTML */ `
			<div class="becky">becky</div>
		`,
		onCreate: createSpy,
		onDestroy: destroySpy,
		onShow: showSpy,
		onClose: closeSpy
	});
	instance.show();

	assert.ok(createSpy.called);
	assert.ok(showSpy.called);

	instance.close();
	instance.destroy();

	assert.ok(destroySpy.called);
	assert.ok(closeSpy.called);
});

it('should use addition HTML class namespace', function() {
	const instance = fn({
		content: /* HTML */ `
			<div class="becky">becky</div>
		`,
		htmlClassNamespace: 'sydney'
	});
	instance.show();

	assert.ok(nodesExist(['.sydney-content[role="dialog"] .becky']));

	instance.destroy();
});

it('should use handle `aria-hidden` for sibling and ancestor elmenents', function() {
	const instance = fn({
		content: /* HTML */ `
			<div class="becky">becky</div>
		`
	});
	instance.show();

	assert.ok(nodesExist(['body *[aria-hidden="true"]:first-child']));

	instance.destroy();

	assert.ok(nodesExist(['body *:not([aria-hidden="true"]):first-child']));
});

it('should handle multiple instances', function() {
	const instanceOne = fn({
		content: /* HTML */ `
			<div class="becky">becky</div>
		`
	});
	const instanceTwo = fn({
		content: /* HTML */ `
			<div class="allie">allie</div>
		`
	});
	const instanceThree = fn({
		content: /* HTML */ `
			<div class="lexie">
				<button
					type="button"
					class="shelby"
					data-statua-dialog-action="close"
				>
					lexie
				</button>
			</div>
		`
	});
	instanceOne.show();
	instanceTwo.show();
	instanceThree.show();

	try {
		assert.ok(
			nodesExist([
				'body *[aria-hidden="true"]:first-child',
				'.statua-Dialog[aria-hidden="true"] .becky',
				'.statua-Dialog[aria-hidden="true"] .allie',
				'.statua-Dialog:not([aria-hidden="true"]) .lexie'
			])
		);

		const closeButton = document.querySelector('.shelby');

		mouseClick(closeButton);

		assert.ok(
			nodesExist([
				'.statua-Dialog[aria-hidden="true"] .becky',
				'.statua-Dialog:not([aria-hidden="true"]) .allie',
				'.statua-Dialog[aria-hidden="true"] .lexie'
			])
		);

		pressEscape(document.body);

		assert.ok(
			nodesExist([
				'.statua-Dialog:not([aria-hidden="true"]) .becky',
				'.statua-Dialog[aria-hidden="true"] .allie',
				'.statua-Dialog[aria-hidden="true"] .lexie'
			])
		);

		pressEscape(document.body);

		assert.ok(
			nodesExist([
				'body *:not([aria-hidden="true"]):first-child',
				'.statua-Dialog[aria-hidden="true"] .becky',
				'.statua-Dialog[aria-hidden="true"] .allie',
				'.statua-Dialog[aria-hidden="true"] .lexie'
			])
		);
	} finally {
		instanceOne.destroy();
		instanceTwo.destroy();
		instanceThree.destroy();
	}
});

it('should cleanup instance on destroy', function() {
	const instance = fn({
		content: /* HTML */ '<div class="becky">becky</div>'
	});
	instance.show();

	assert.ok(nodesExist(['.statua-Dialog-content[role="dialog"] .becky']));

	instance.destroy();

	assert.ok(!nodesExist(['.statua-Dialog-content[role="dialog"] .becky']));
});
