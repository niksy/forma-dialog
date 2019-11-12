# z-dialog

[![Build Status][ci-img]][ci]
[![BrowserStack Status][browserstack-img]][browserstack]

Lightweight and accessible dialog component.

Features:

-   Best accessibility practices baked in
-   Tab and focus lock on tabbable elements inside dialog
-   Flexible styling

**[Try it now!](https://codesandbox.io/s/basic-example-mppkz)**

## Install

```sh
npm install z-dialog --save
```

## Usage

```js
import dialog from 'z-dialog';

const instance = dialog({
	content: `<p>Dialog content</p>`
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

##### htmlClassNamespace

Type: `string`  
Default: ` `

HTML class namespace in addition to default one (`z-Dialog`).

Useful if you want to create additional styling/functionality selector hook.

### instance.show()

Show dialog.

### instance.destroy()

Destroy dialog instance.

## DOM API

Dialog instance can be controlled with certain DOM attributes.

### `[data-z-dialog-action="close"]`

Closes closest dialog instance when clicking on element.

## Browser support

Tested in IE11+ and all modern browsers.

## Test

For automated tests, run `npm run test:automated` (append `:watch` for watcher
support).

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

<!-- prettier-ignore-start -->

[ci]: https://travis-ci.com/niksy/z-dialog
[ci-img]: https://travis-ci.com/niksy/z-dialog.svg?branch=master
[browserstack]: https://www.browserstack.com/
[browserstack-img]: https://www.browserstack.com/automate/badge.svg?badge_key=MVVsbU5zaVZVUFMzNlhxRTR1OFVTZzNDYkdSNUxsM25mQThqeFZnQTgxMD0tLVBMVldpRlNaUCsvbFdSQU5zVnJiNUE9PQ==--0221eba3e4b920cc64460d01c5863becf218c09a

<!-- prettier-ignore-end -->
