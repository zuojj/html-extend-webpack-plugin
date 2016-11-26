# html-extend-webpack-plugin

Extended from [html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin), support stylesheet and script file inline to html and tag add attributes


## Installation
```shell
npm install --save-dev html-extend-webpack-plugin
```

## Extended from html-webpack-plugin Configuration
You can pass a hash of configuration options to `HtmlWebpackPlugin`.
Allowed values are as follows:

- `title`: The title to use for the generated HTML document.
- `filename`: The file to write the HTML to. Defaults to `index.html`.
   You can specify a subdirectory here too (eg: `assets/admin.html`).
- `template`: Webpack require path to the template. Please see the [docs](https://github.com/ampedandwired/html-webpack-plugin/blob/master/docs/template-option.md) for details. 
- `inject`: `true | 'head' | 'body' | false` Inject all assets into the given `template` or `templateContent` - When passing `true` or `'body'` all javascript resources will be placed at the bottom of the body element. `'head'` will place the scripts in the head element.
- `favicon`: Adds the given favicon path to the output html.
- `minify`: `{...} | false` Pass a [html-minifier](https://github.com/kangax/html-minifier#options-quick-reference) options object to minify the output.
- `hash`: `true | false` if `true` then append a unique webpack compilation hash to all
  included scripts and CSS files. This is useful for cache busting.
- `cache`: `true | false` if `true` (default) try to emit the file only if it was changed.
- `showErrors`: `true | false` if `true` (default) errors details will be written into the html page.
- `chunks`: Allows you to add only some chunks (e.g. only the unit-test chunk)
- **`chunksExtend`: `object` extend chunks, support inline stylesheet and script, can add external attributes**
- `chunksSortMode`: Allows to control how chunks should be sorted before they are included to the html. Allowed values: 'none' | 'auto' | 'dependency' | {function} - default: 'auto'
- `excludeChunks`: Allows you to skip some chunks (e.g. don't add the unit-test chunk)
- `xhtml`: `true | false` If `true` render the `link` tags as self-closing, XHTML compliant. Default is `false`

Here's an example webpack config illustrating how to use these options:
```javascript
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const HtmlExtendWebpackPlugin = require('html-extend-webpack-plugin');

module.exports = {
    plugins: [
        new CommonsChunkPlugin({
            name: 'common',
            filename: 'static/js/common.js',
            minChunks: 2
        }),
        new HtmlExtendWebpackPlugin({
            inject: true,
            template: './src/jzwd/ksmap01/ksmap01.html',
            chunks: ['common', 'ksmap01'],
            chunksExtend: {
                ksmap01: {
                    stylesheet: {
                        inline: true,
                        attrs: {
                            id: 'miniStyle'
                        }
                    },
                    script: {
                        inline: true,
                        attrs: {
                            id: 'miniScript'
                        }
                    }
                }
            },
            filename: 'ksmap01.html',
        })
        new ExtractTextPlugin('static/css/[name].css')
    ]
}
```


You can also add stylesheet placehodler and javascript placehoder to your template as follows:
```html
<div class="container">
CSS_PLACEHOLDER
    <label>时间段：</label>
    <input type="text" id="date_start">
    <span style="margin: 0 10px">-</span>
    <input type="text" id="date_end">
JS_PLACEHOLDER
</div>
```

The result after compile it:
```html
<div class="container">
    <link type="text/css" rel="stylesheet" href="static/css/common.css">
    <style type="text/css">
    .sd-datepicker {
        display: none;
        width: 193px;
        padding: 0 5px 5px;
        z-index: 12;
        color: #bbb;
        border: 1px solid #ddd;
        border-radius: 2px;
        background: #fff;
        box-shadow: 0 2px 5px #d9d9d9;
    }
    </style>
    <label>时间段：</label>
    <input type="text" id="date_start">
    <span style="margin: 0 10px">-</span>
    <input type="text" id="date_end">
    <script src="static/js/common.js"></script>
    <script asyn="true">
    webpackJsonp([0], {

        /***/
        0:
        /***/
            function(module, exports, __webpack_require__) {

            'use strict';

            __webpack_require__(1);
            __webpack_require__(5);

            __webpack_require__.e /* nsure */ (1, function(require) {
                var DatePicker = __webpack_require__(8);

                var dateStart = new DatePicker('#date_start');
                var dateEnd = new DatePicker('#date_end');
            });

            /***/
        },

        /***/
        5:
        /***/
            function(module, exports) {

            // removed by extract-text-webpack-plugin

            /***/
        }

    });
    </script>
</div>
```
The inline stylesheet priority: CSS_PLACEHOLDER > `</head>` > no `</head>`
The inline script priority: JS_PLACEHOLDER > `</body>` > no `</body>`
