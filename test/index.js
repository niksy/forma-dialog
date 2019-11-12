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

it('should create instance with string as content', async function() {
	const instance = fn({
		content: /* HTML */ '<div class="becky">becky</div>'
	});
	instance.show();

	assert.ok(nodesExist(['.z-Dialog-content[role="dialog"] .becky']));

	instance.destroy();
});

it('should create instance with DOM node as content', async function() {
	const node = html`
		<div class="archie">archie</div>
	`;
	const instance = fn({
		content: node
	});
	instance.show();

	assert.ok(nodesExist(['.z-Dialog-content[role="dialog"] .archie']));

	instance.destroy();
});

it('should throw error if content doesn’t exist', async function() {
	assert.throws(() => {
		fn();
	}, /TypeError: Content is not defined./);
});

it('should destroy instance when pressing Escape key', async function() {
	const instance = fn({
		content: /* HTML */ `
			<div class="becky">becky</div>
		`
	});
	instance.show();

	assert.ok(nodesExist(['.z-Dialog-content[role="dialog"] .becky']));

	pressEscape(document.body);

	assert.ok(!nodesExist(['.z-Dialog-content[role="dialog"] .becky']));

	instance.destroy();
});

it('should destroy instance when clicking outside dialog', async function() {
	const instance = fn({
		content: /* HTML */ `
			<div class="becky">becky</div>
		`
	});
	instance.show();

	const element = document.querySelector('.z-Dialog');

	mouseClick(element);

	assert.ok(nodesExist(['.z-Dialog-content[role="dialog"] .becky']));

	mouseClick(document.body);

	assert.ok(!nodesExist(['.z-Dialog-content[role="dialog"] .becky']));

	instance.destroy();
});

it('should destroy instance when clicking on [data-z-dialog-action="close"]', async function() {
	const instance = fn({
		content: /* HTML */ `
			<div class="becky">
				<button type="button" class="molly">molly</button>
				<button
					type="button"
					class="honey"
					data-z-dialog-action="close"
				>
					honey
				</button>
			</div>
		`
	});
	instance.show();

	const element = document.querySelector('.z-Dialog');
	const genericButton = document.querySelector('.molly');
	const closeButton = document.querySelector('.honey');

	mouseClick(genericButton);

	assert.ok(nodesExist(['.z-Dialog-content[role="dialog"] .becky']));

	mouseClick(closeButton);

	assert.ok(!nodesExist(['.z-Dialog-content[role="dialog"] .becky']));

	instance.destroy();
});

it('should call lifecycle methods', async function() {
	const createSpy = sinon.spy();
	const destroySpy = sinon.spy();

	const instance = fn({
		content: /* HTML */ `
			<div class="becky">becky</div>
		`,
		onCreate: createSpy,
		onDestroy: destroySpy
	});
	instance.show();

	assert.ok(createSpy.called);

	instance.destroy();

	assert.ok(destroySpy.called);
});

it('should use addition HTML class namespace', async function() {
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
