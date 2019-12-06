# @statua/dialog

[![Build Status][ci-img]][ci]
[![BrowserStack Status][browserstack-img]][browserstack]

Dialog component.

Features:

-   Best accessibility practices baked in
-   Tab and focus lock on tabbable elements inside dialog
-   Flexible styling
-   Sets `aria-hidden` on all sibling and ancestor elements except for the
    currently active dialog which traps the virtual cursor inside the dialog

**[Try it now!](https://codesandbox.io/s/basic-example-k7zml)**

## Install

```sh
npm install @statua/dialog --save
```

## Usage

```js
import dialog from '@statua/dialog';

const instance = dialog({
	content: `<p>Becky</p>`
});

instance.show();
```

## API

### dialog(options)

Returns: `Object`

Creates dialog instance. Dialog element will be appended to `body` element.

#### options

Type: `Object`

##### content

Type: `string|Node`  
**Required**

Dialog content which can be:

-   HTML string
-   Instance of `Node` (DOM node, HTML comment, document fragment, …)

##### onCreate

Type: `Function`  
Default: `() => {}`

Callback to run when dialog instance is created.

##### onDestroy

Type: `Function`  
Default: `() => {}`

Callback to run when dialog instance is destroyed.

Useful when you want to perform operations such as moving dialog content to
original location if dialog content was already existing DOM node.

##### onShow

Type: `Function`  
Default: `() => {}`

Callback to run when dialog instance is shown.

##### onClose

Type: `Function`  
Default: `() => {}`

Callback to run when dialog instance is closed.

##### htmlClassNamespace

Type: `string`  
Default: ``

HTML class namespace in addition to default one (`statua-Dialog`).

Useful if you want to create additional styling/functionality selector hook.

### instance.show()

Show dialog.

### instance.close()

Close dialog.

### instance.destroy()

Destroy dialog instance.

## DOM API

Dialog instance can be controlled with certain DOM attributes.

### `[data-statua-dialog-action="close"]`

Closes closest dialog instance when clicking on element.

## Browser support

Tested in IE11+ and all modern browsers.

## Test

For automated tests, run `npm run test:automated` (append `:watch` for watcher
support).

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

<!-- prettier-ignore-start -->

[ci]: https://travis-ci.com/niksy/statua-dialog
[ci-img]: https://travis-ci.com/niksy/statua-dialog.svg?branch=master
[browserstack]: https://www.browserstack.com/
[browserstack-img]: https://www.browserstack.com/automate/badge.svg?badge_key=TVpLaVUwTFVlVmZMbjZjaFlkZTJXQTRyb3pmVnVZdkEvVFNSTnQxWlFoYz0tLUpaeTFVUHZjaEV4ckVzTHQ1Wk01ekE9PQ==--125aa92b4fd002789ed9842e3882f334fb1df5ac

<!-- prettier-ignore-end -->
