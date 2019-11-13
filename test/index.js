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

	assert.ok(nodesExist(['.z-Dialog-content[role="dialog"] .becky']));

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

	assert.ok(nodesExist(['.z-Dialog-content[role="dialog"] .archie']));

	instance.destroy();
});

it('should throw error if content doesn’t exist', function() {
	assert.throws(() => {
		fn();
	}, /TypeError: Content is not defined./);
});

it('should destroy instance when pressing Escape key', function() {
	const instance = fn({
		content: /* HTML */ `
			<div class="becky">becky</div>
		`
	});
	instance.show();

	try {
		assert.ok(nodesExist(['.z-Dialog-content[role="dialog"] .becky']));

		pressEscape(document.body);

		assert.ok(!nodesExist(['.z-Dialog-content[role="dialog"] .becky']));
	} finally {
		instance.destroy();
	}
});

it('should destroy instance when clicking outside dialog', function() {
	const instance = fn({
		content: /* HTML */ `
			<div class="becky">becky</div>
		`
	});
	instance.show();

	const element = document.querySelector('.z-Dialog');
	const outsideElement = document.querySelector('.z-Dialog-backdrop');

	try {
		mouseClick(element);

		assert.ok(nodesExist(['.z-Dialog-content[role="dialog"] .becky']));

		mouseClick(outsideElement);

		assert.ok(!nodesExist(['.z-Dialog-content[role="dialog"] .becky']));
	} finally {
		instance.destroy();
	}
});

it('should destroy instance when clicking on [data-z-dialog-action="close"]', function() {
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

	try {
		mouseClick(genericButton);

		assert.ok(nodesExist(['.z-Dialog-content[role="dialog"] .becky']));

		mouseClick(closeButton);

		assert.ok(!nodesExist(['.z-Dialog-content[role="dialog"] .becky']));
	} finally {
		instance.destroy();
	}
});

it('should call lifecycle methods', function() {
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
