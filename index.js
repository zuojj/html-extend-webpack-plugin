'use strict';
var vm = require('vm');
var fs = require('fs');
var _ = require('lodash');
var Promise = require('bluebird');
var path = require('path');
var childCompiler = require('./lib/compiler.js');
var prettyError = require('./lib/errors.js');
var chunkSorter = require('./lib/chunksorter.js');
Promise.promisifyAll(fs);

function HtmlExtendWebpackPlugin(options) {
    // Default options
    this.options = _.extend({
        template: path.join(__dirname, 'default_index.ejs'),
        filename: 'index.html',
        hash: false,
        inject: true,
        compile: true,
        favicon: false,
        minify: false,
        cache: true,
        showErrors: true,
        chunks: 'all',
        excludeChunks: [],
        title: 'Webpack App',
        xhtml: false
    }, options);
}

HtmlExtendWebpackPlugin.prototype.apply = function(compiler) {
    var self = this;
    var isCompilationCached = false;
    var compilationPromise;

    this.options.template = this.getFullTemplatePath(this.options.template, compiler.context);

    // convert absolute filename into relative so that webpack can
    // generate it at correct location
    var filename = this.options.filename;

    if (path.resolve(filename) === path.normalize(filename)) {
        this.options.filename = path.relative(compiler.options.output.path, filename);
    }

    compiler.plugin('make', function(compilation, callback) {
        // Compile the template (queued)
        compilationPromise = childCompiler.compileTemplate(self.options.template, compiler.context, self.options.filename, compilation)
            .catch(function(err) {
                compilation.errors.push(prettyError(err, compiler.context).toString());
                return {
                    content: self.options.showErrors ? prettyError(err, compiler.context).toJsonHtml() : 'ERROR',
                    outputName: self.options.filename
                };
            })
            .then(function(compilationResult) {
                // If the compilation change didnt change the cache is valid
                isCompilationCached = compilationResult.hash && self.childCompilerHash === compilationResult.hash;
                self.childCompilerHash = compilationResult.hash;
                self.childCompilationOutputName = compilationResult.outputName;
                callback();

                // 对所有子模块(img, css, js)进行编译， 生成compilationResult;
                // { hash: 'c523b7168cc0fa06c5cea2628deee602',
                //   outputName: 'ksmap02.html',
                //   content: 'var HTML_WEBPACK_PLUGIN_RESULT =\n/******/ (function(modules) { // webpackBootstrap\n/******/ \t// The module cache\n/******/ \tvar installedModules = {};\n\n/******/ \t// The require function\n/******/ \tfunction __webpack_require__(moduleId) {\n\n/******/ \t\t// Check if module is in cache\n/******/ \t\tif(installedModules[moduleId])\n/******/ \t\t\treturn installedModules[moduleId].exports;\n\n/******/ \t\t// Create a new module (and put it into the cache)\n/******/ \t\tvar module = installedModules[moduleId] = {\n/******/ \t\t\texports: {},\n/******/ \t\t\tid: moduleId,\n/******/ \t\t\tloaded: false\n/******/ \t\t};\n\n/******/ \t\t// Execute the module function\n/******/ \t\tmodules[moduleId].call(module.exports, module, module.exports, __webpack_require__);\n\n/******/ \t\t// Flag the module as loaded\n/******/ \t\tmodule.loaded = true;\n\n/******/ \t\t// Return the exports of the module\n/******/ \t\treturn module.exports;\n/******/ \t}\n\n\n/******/ \t// expose the modules object (__webpack_modules__)\n/******/ \t__webpack_require__.m = modules;\n\n/******/ \t// expose the module cache\n/******/ \t__webpack_require__.c = installedModules;\n\n/******/ \t// __webpack_public_path__\n/******/ \t__webpack_require__.p = "";\n\n/******/ \t// Load entry module and return exports\n/******/ \treturn __webpack_require__(0);\n/******/ })\n/************************************************************************/\n/******/ ([\n/* 0 */\n/***/ function(module, exports, __webpack_require__) {\n\n\tmodule.exports = "<!DOCTYPE html>\\r\\n<html>\\r\\n\\r\\n<head>\\r\\n    <meta charset=\\"utf-8\\">\\r\\n    <meta http-equiv=\\"X-UA-Compatible\\" content=\\"IE=edge,chrome=1\\">\\r\\n    <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no\\">\\r\\n    <title>Examples</title>\\r\\n    <meta name=\\"description\\" content=\\"\\">\\r\\n    <meta name=\\"keywords\\" content=\\"\\">\\r\\n    <style type=\\"text/css\\">\\r\\n    .container {\\r\\n        width: 800px;\\r\\n        height: 400px;\\r\\n        margin: 0 auto;\\r\\n    }\\r\\n    </style>\\r\\n</head>\\r\\n\\r\\n<body>\\r\\n    <div class=\\"container\\">\\r\\n        <div class=\\"sd-slider\\">\\r\\n            <div class=\\"sd-slider-item\\">\\r\\n                <a href=\\"#\\">\\r\\n                    <img src=\\"" + __webpack_require__(1) + "\\" />\\r\\n                    <div class=\\"text\\">\\r\\n                        <p>上海老伯00年只做葱油饼 美味惊动BBC</p>\\r\\n                    </div>\\r\\n                </a>\\r\\n            </div>\\r\\n            <div class=\\"sd-slider-item\\">\\r\\n                <a href=\\"#\\">\\r\\n                    <img src=\\"" + __webpack_require__(2) + "\\">\\r\\n                    <div class=\\"text\\">\\r\\n                        <p>上海老伯01年只做葱油饼 美味惊动BBC</p>\\r\\n                    </div>\\r\\n                </a>\\r\\n            </div>\\r\\n            <div class=\\"sd-slider-item\\">\\r\\n                <a href=\\"#\\">\\r\\n                    <img src=\\"" + __webpack_require__(3) + "\\">\\r\\n                    <div class=\\"text\\">\\r\\n                        <p>上海老伯02年只做葱油饼 美味惊动BBC</p>\\r\\n                    </div>\\r\\n                </a>\\r\\n            </div>\\r\\n            <div class=\\"sd-slider-item\\">\\r\\n                <a href=\\"#\\">\\r\\n                    <img src=\\"" + __webpack_require__(4) + "\\" />\\r\\n                    <div class=\\"text\\">\\r\\n                        <p>上海老伯03年只做葱油饼 美味惊动BBC</p>\\r\\n                    </div>\\r\\n                </a>\\r\\n            </div>\\r\\n        </div>\\r\\n    </div>\\r\\n</body>\\r\\n\\r\\n</html>\\r\\n";\n\n/***/ },\n/* 1 */\n/***/ function(module, exports, __webpack_require__) {\n\n\tmodule.exports = __webpack_require__.p + "/static/images/1.jpg";\n\n/***/ },\n/* 2 */\n/***/ function(module, exports, __webpack_require__) {\n\n\tmodule.exports = __webpack_require__.p + "/static/images/2.jpg";\n\n/***/ },\n/* 3 */\n/***/ function(module, exports, __webpack_require__) {\n\n\tmodule.exports = __webpack_require__.p + "/static/images/3.jpg";\n\n/***/ },\n/* 4 */\n/***/ function(module, exports, __webpack_require__) {\n\n\tmodule.exports = __webpack_require__.p + "/static/images/4.jpg";\n\n/***/ }\n/******/ ]);'
                // }

                return compilationResult.content;
            });
    });

    compiler.plugin('emit', function(compilation, callback) {
        var applyPluginsAsyncWaterfall = self.applyPluginsAsyncWaterfall(compilation);

        // Get all chunks
        /*[{
            id: 0,
            rendered: true,
            initial: true,
            entry: false,
            extraAsync: false,
            size: 328,
            names: ['ksmap01'],
            files: ['static/js/ksmap01.js', 'static/css/ksmap01.css'],
            hash: '489264836710868eddc6',
            parents: [4],
            origins: [
                [Object]
            ]
        }, {
            id: 4,
            rendered: true,
            initial: true,
            entry: true,
            extraAsync: false,
            size: 41,
            names: ['common'],
            files: ['static/js/common.js', 'static/css/common.css'],
            hash: 'f251edd69a985b7c388b',
            parents: [],
            origins: []
        }]*/
        var chunks = self.filterChunks(compilation.getStats().toJson(), self.options.chunks, self.options.excludeChunks);

        // Sort chunks
        chunks = self.sortChunks(chunks, self.options.chunksSortMode);
        // Let plugins alter the chunks and the chunk sorting
        chunks = compilation.applyPluginsWaterfall('html-webpack-plugin-alter-chunks', chunks, {
            plugin: self
        });

        // sort after
        /*[{
            id: 4,
            rendered: true,
            initial: true,
            entry: true,
            extraAsync: false,
            size: 41,
            names: ['common'],
            files: ['static/js/common.js', 'static/css/common.css'],
            hash: 'f251edd69a985b7c388b',
            parents: [],
            origins: []
        }, {
            id: 0,
            rendered: true,
            initial: true,
            entry: false,
            extraAsync: false,
            size: 328,
            names: ['ksmap01'],
            files: ['static/js/ksmap01.js', 'static/css/ksmap01.css'],
            hash: '489264836710868eddc6',
            parents: [4],
            origins: [
                [Object]
            ]
        }]*/


        // Get assets
        var assets = self.HtmlExtendWebpackPluginAssets(compilation, chunks);

        // If this is a hot update compilation, move on!
        // This solves a problem where an `index.html` file is generated for hot-update js files
        // It only happens in Webpack 2, where hot updates are emitted separately before the full bundle
        if (self.isHotUpdateCompilation(assets)) {
            return callback();
        }

        // If the template and the assets did not change we don't have to emit the html
        var assetJson = JSON.stringify(self.getAssetFiles(assets));
        if (isCompilationCached && self.options.cache && assetJson === self.assetJson) {
            return callback();
        } else {
            self.assetJson = assetJson;
        }

        Promise.resolve()
            // Favicon
            .then(function() {
                if (self.options.favicon) {
                    return self.addFileToAssets(self.options.favicon, compilation)
                        .then(function(faviconBasename) {
                            var publicPath = compilation.mainTemplate.getPublicPath({
                                hash: compilation.hash
                            }) || '';
                            if (publicPath && publicPath.substr(-1) !== '/') {
                                publicPath += '/';
                            }
                            assets.favicon = publicPath + faviconBasename;
                        });
                }
            })
            // Wait for the compilation to finish
            .then(function() {
                return compilationPromise;
            })
            .then(function(compiledTemplate) {
                // Allow to use a custom function / string instead
                if (self.options.templateContent !== undefined) {
                    return self.options.templateContent;
                }
                // Once everything is compiled evaluate the html factory
                // and replace it with its content
                return self.evaluateCompilationResult(compilation, compiledTemplate);
            })
            // Allow plugins to make changes to the assets before invoking the template
            // This only makes sense to use if `inject` is `false`
            .then(function(compilationResult) {
                return applyPluginsAsyncWaterfall('html-webpack-plugin-before-html-generation', false, {
                        assets: assets,
                        outputName: self.childCompilationOutputName,
                        plugin: self
                    })
                    .then(function() {
                        return compilationResult;
                    });
            })
            // Execute the template
            .then(function(compilationResult) {
                // If the loader result is a function execute it to retrieve the html
                // otherwise use the returned html
                return typeof compilationResult !== 'function' ? compilationResult : self.executeTemplate(compilationResult, chunks, assets, compilation);
            })
            // Allow plugins to change the html before assets are injected
            .then(function(html) {
                var pluginArgs = {
                    html: html,
                    assets: assets,
                    plugin: self,
                    outputName: self.childCompilationOutputName
                };
                return applyPluginsAsyncWaterfall('html-webpack-plugin-before-html-processing', true, pluginArgs);
            })
            .then(function(result) {
                var html = result.html;
                var assets = result.assets;
                var chunks = result.chunks;
                // Prepare script and link tags
                var assetTags = self.generateAssetTags(assets);
                var pluginArgs = {
                    head: assetTags.head,
                    body: assetTags.body,
                    plugin: self,
                    chunks: chunks,
                    outputName: self.childCompilationOutputName
                };
                // Allow plugins to change the assetTag definitions
                return applyPluginsAsyncWaterfall('html-webpack-plugin-alter-asset-tags', true, pluginArgs)
                    .then(function(result) {
                        /*{
                            head: [{
                                tagName: 'link',
                                selfClosingTag: false,
                                attributes: { href: 'static/css/common.css', rel: 'stylesheet' }
                            }, {
                                tagName: 'link',
                                selfClosingTag: false,
                                attributes: { href: 'static/css/ksmap01.css', rel: 'stylesheet' }
                            }],
                            body: [{
                                tagName: 'script',
                                closeTag: true,
                                attributes: { type: 'text/javascript', src: 'static/js/common.js' }
                            }, {
                                tagName: 'script',
                                closeTag: true,
                                attributes: { type: 'text/javascript', src: 'static/js/ksmap01.js' }
                            }],
                            plugin: HtmlExtendWebpackPlugin {
                                options: {
                                    template: '/Users/zuojunjun/workspace/vr-webpack-workspace/node_modules/html-webpack-plugin/lib/loader.js!/Users/zuojunjun/workspace/vr-webpack-workspace/src/jzwd/ksmap01/ksmap01.html',
                                    filename: 'ksmap01.html',
                                    hash: false,
                                    inject: true,
                                    compile: true,
                                    favicon: false,
                                    minify: false,
                                    cache: true,
                                    showErrors: true,
                                    chunks: [Object],
                                    excludeChunks: [],
                                    title: 'Webpack App',
                                    xhtml: false
                                },
                                childCompilerHash: '04698312ffee4f94353dbc05723fb59c',
                                childCompilationOutputName: 'ksmap01.html',
                                assetJson: '["static/css/common.css","static/css/ksmap01.css","static/js/common.js","static/js/ksmap01.js"]'
                            },
                            chunks: undefined,
                            outputName: 'ksmap01.html'
                        }*/
                        // !!!!!
                        // Add the stylesheets, scripts and so on to the resulting html
                        return self.postProcessHtml(html, assets, {
                                body: result.body,
                                head: result.head
                            })
                            .then(function(html) {
                                return _.extend(result, {
                                    html: html,
                                    assets: assets
                                });
                            });
                    });
            })
            // Allow plugins to change the html after assets are injected
            .then(function(result) {
                var html = result.html;
                var assets = result.assets;
                var pluginArgs = {
                    html: html,
                    assets: assets,
                    plugin: self,
                    outputName: self.childCompilationOutputName
                };
                return applyPluginsAsyncWaterfall('html-webpack-plugin-after-html-processing', true, pluginArgs)
                    .then(function(result) {
                        return result.html;
                    });
            })
            .catch(function(err) {
                // In case anything went wrong the promise is resolved
                // with the error message and an error is logged
                compilation.errors.push(prettyError(err, compiler.context).toString());
                // Prevent caching
                self.hash = null;
                return self.options.showErrors ? prettyError(err, compiler.context).toHtml() : 'ERROR';
            })
            .then(function(html) {
                // Replace the compilation result with the evaluated html code
                compilation.assets[self.childCompilationOutputName] = {
                    source: function() {
                        return html;
                    },
                    size: function() {
                        return html.length;
                    }
                };
            })
            .then(function() {
                // Let other plugins know that we are done:
                return applyPluginsAsyncWaterfall('html-webpack-plugin-after-emit', false, {
                    html: compilation.assets[self.childCompilationOutputName],
                    outputName: self.childCompilationOutputName,
                    plugin: self
                }).catch(function(err) {
                    console.error(err);
                    return null;
                }).then(function() {
                    return null;
                });
            })
            // Let webpack continue with it
            .finally(function() {
                callback();
                // Tell blue bird that we don't want to wait for callback.
                // Fixes "Warning: a promise was created in a handler but none were returned from it"
                // https://github.com/petkaantonov/bluebird/blob/master/docs/docs/warning-explanations.md#warning-a-promise-was-created-in-a-handler-but-none-were-returned-from-it
                return null;
            });
    });
};

/**
 * Evaluates the child compilation result
 * Returns a promise
 */
HtmlExtendWebpackPlugin.prototype.evaluateCompilationResult = function(compilation, source) {
    if (!source) {
        return Promise.reject('The child compilation didn\'t provide a result');
    }

    // The LibraryTemplatePlugin stores the template result in a local variable.
    // To extract the result during the evaluation this part has to be removed.
    source = source.replace('var HTML_WEBPACK_PLUGIN_RESULT =', '');
    var template = this.options.template.replace(/^.+!/, '').replace(/\?.+$/, '');
    var vmContext = vm.createContext(_.extend({
        HTML_WEBPACK_PLUGIN: true,
        require: require
    }, global));
    var vmScript = new vm.Script(source, {
        filename: template
    });
    // Evaluate code and cast to string
    var newSource;
    try {
        newSource = vmScript.runInContext(vmContext);
    } catch (e) {
        return Promise.reject(e);
    }
    return typeof newSource === 'string' || typeof newSource === 'function' ? Promise.resolve(newSource) : Promise.reject('The loader "' + this.options.template + '" didn\'t return html.');
};

/**
 * Html post processing
 *
 * Returns a promise
 */
HtmlExtendWebpackPlugin.prototype.executeTemplate = function(templateFunction, chunks, assets, compilation) {
    var self = this;
    return Promise.resolve()
        // Template processing
        .then(function() {
            var templateParams = {
                compilation: compilation,
                webpack: compilation.getStats().toJson(),
                webpackConfig: compilation.options,
                HtmlExtendWebpackPlugin: {
                    files: assets,
                    options: self.options
                }
            };
            var html = '';
            try {
                html = templateFunction(templateParams);
            } catch (e) {
                compilation.errors.push(new Error('Template execution failed: ' + e));
                return Promise.reject(e);
            }
            return html;
        });
};

/**
 * Html post processing
 *
 * Returns a promise
 */
HtmlExtendWebpackPlugin.prototype.postProcessHtml = function(html, assets, assetTags) {
    var self = this;
    if (typeof html !== 'string') {
        return Promise.reject('Expected html to be a string but got ' + JSON.stringify(html));
    }
    return Promise.resolve()
        // Inject
        .then(function() {
            if (self.options.inject) {
                return self.injectAssetsIntoHtml(html, assets, assetTags);
            } else {
                return html;
            }
        })
        // Minify
        .then(function(html) {
            if (self.options.minify) {
                var minify = require('html-minifier').minify;
                return minify(html, self.options.minify);
            }
            return html;
        });
};

/*
 * Pushes the content of the given filename to the compilation assets
 */
HtmlExtendWebpackPlugin.prototype.addFileToAssets = function(filename, compilation) {
    filename = path.resolve(compilation.compiler.context, filename);
    return Promise.props({
            size: fs.statAsync(filename),
            source: fs.readFileAsync(filename)
        })
        .catch(function() {
            return Promise.reject(new Error('HtmlExtendWebpackPlugin: could not load file ' + filename));
        })
        .then(function(results) {
            var basename = path.basename(filename);
            compilation.fileDependencies.push(filename);
            compilation.assets[basename] = {
                source: function() {
                    return results.source;
                },
                size: function() {
                    return results.size.size;
                }
            };
            return basename;
        });
};

/**
 * Helper to sort chunks
 */
HtmlExtendWebpackPlugin.prototype.sortChunks = function(chunks, sortMode) {
    // Sort mode auto by default:
    if (typeof sortMode === 'undefined') {
        sortMode = 'auto';
    }
    // Custom function
    if (typeof sortMode === 'function') {
        return chunks.sort(sortMode);
    }
    // Disabled sorting:
    if (sortMode === 'none') {
        return chunkSorter.none(chunks);
    }
    // Check if the given sort mode is a valid chunkSorter sort mode
    if (typeof chunkSorter[sortMode] !== 'undefined') {
        return chunkSorter[sortMode](chunks);
    }
    throw new Error('"' + sortMode + '" is not a valid chunk sort mode');
};

/**
 * Return all chunks from the compilation result which match the exclude and include filters
 */
HtmlExtendWebpackPlugin.prototype.filterChunks = function(webpackStatsJson, includedChunks, excludedChunks) {
    return webpackStatsJson.chunks.filter(function(chunk) {
        var chunkName = chunk.names[0];
        // This chunk doesn't have a name. This script can't handled it.
        if (chunkName === undefined) {
            return false;
        }
        // Skip if the chunk should be lazy loaded
        if (!chunk.initial) {
            return false;
        }
        // Skip if the chunks should be filtered and the given chunk was not added explicity
/*        if (Array.isArray(includedChunks) && includedChunks.indexOf(chunkName) === -1) {
            return false;
        }*/

        if(includedChunks && 'object' === typeof includedChunks && includedChunks[chunkName]) {
            chunk.chunkExtend = includedChunks[chunkName];
        }else {
            return false;
        }

        // Skip if the chunks should be filtered and the given chunk was excluded explicity
        if (Array.isArray(excludedChunks) && excludedChunks.indexOf(chunkName) !== -1) {
            return false;
        }
        // Add otherwise
        return true;
    });
};

HtmlExtendWebpackPlugin.prototype.isHotUpdateCompilation = function(assets) {
    return assets.js.length && assets.js.every(function(name) {
        return /\.hot-update\.js$/.test(name);
    });
};

HtmlExtendWebpackPlugin.prototype.HtmlExtendWebpackPluginAssets = function(compilation, chunks) {
    var self = this;
    var webpackStatsJson = compilation.getStats().toJson();
    // Use the configured public path or build a relative path
    var publicPath = typeof compilation.options.output.publicPath !== 'undefined'
        // If a hard coded public path exists use it
        ? compilation.mainTemplate.getPublicPath({
            hash: webpackStatsJson.hash
        })
        // If no public path was set get a relative url path
        : path.relative(path.resolve(compilation.options.output.path, path.dirname(self.childCompilationOutputName)), compilation.options.output.path)
        .split(path.sep).join('/');

    if (publicPath.length && publicPath.substr(-1, 1) !== '/') {
        publicPath += '/';
    }

    var assets = {
        // The public path
        publicPath: publicPath,
        // Will contain all js & css files by chunk
        chunks: {},
        // Will contain all js files
        js: [],
        // Will contain all css files
        css: [],
        // Will contain the html5 appcache manifest files if it exists
        manifest: Object.keys(compilation.assets).filter(function(assetFile) {
            return path.extname(assetFile) === '.appcache';
        })[0]
    };

    // Append a hash for cache busting
    if (this.options.hash) {
        assets.manifest = self.appendHash(assets.manifest, webpackStatsJson.hash);
        assets.favicon = self.appendHash(assets.favicon, webpackStatsJson.hash);
    }
    /* chunks
    [{
        id: 4,
        rendered: true,
        initial: true,
        entry: true,
        extraAsync: false,
        size: 41,
        names: ['common'],
        files: ['static/js/common.js', 'static/css/common.css'],
        hash: 'f251edd69a985b7c388b',
        parents: [],
        origins: []
    }, {
        id: 0,
        rendered: true,
        initial: true,
        entry: false,
        extraAsync: false,
        size: 328,
        names: ['ksmap01'],
        files: ['static/js/ksmap01.js', 'static/css/ksmap01.css'],
        hash: '489264836710868eddc6',
        parents: [4],
        origins: [
            [Object]
        ]
    }]*/

    for (var i = 0; i < chunks.length; i++) {
        var chunk = chunks[i];
        var chunkName = chunk.names[0];

        assets.chunks[chunkName] = chunk.chunkExtend || {};

        // Prepend the public path to all chunk files
        var chunkFiles = [].concat(chunk.files).map(function(chunkFile) {
            return publicPath + chunkFile;
        });

        // Append a hash for cache busting
        if (this.options.hash) {
            chunkFiles = chunkFiles.map(function(chunkFile) {
                return self.appendHash(chunkFile, webpackStatsJson.hash);
            });
        }

        // Webpack outputs an array for each chunk when using sourcemaps
        // But we need only the entry file
        var entry = chunkFiles[0];
        assets.chunks[chunkName].size = chunk.size;
        assets.chunks[chunkName].entry = entry;
        assets.chunks[chunkName].hash = chunk.hash;
        assets.js.push(entry);

        // Gather all css files
        var css = chunkFiles.filter(function(chunkFile) {
            // Some chunks may contain content hash in their names, for ex. 'main.css?1e7cac4e4d8b52fd5ccd2541146ef03f'.
            // We must proper handle such cases, so we use regexp testing here
            return /.css($|\?)/.test(chunkFile);
        });

        // [ 'static/css/common.css' ]
        assets.chunks[chunkName].css = css;
        assets.css = assets.css.concat(css);
    }

    // Duplicate css assets can occur on occasion if more than one chunk
    // requires the same css.
    assets.css = _.uniq(assets.css);

    /*{
        publicPath: '',
        chunks: {
            common: {
                size: 41,
                entry: 'static/js/common.js',
                hash: 'f251edd69a985b7c388b',
                css: [Object]
            },
            ksmap01: {
                size: 328,
                entry: 'static/js/ksmap01.js',
                hash: '489264836710868eddc6',
                css: [Object]
            }
        },
        js: ['static/js/common.js', 'static/js/ksmap01.js'],
        css: ['static/css/common.css', 'static/css/ksmap01.css'],
        manifest: undefined
    }*/

    return assets;
};

/**
 * Injects the assets into the given html string
 */
HtmlExtendWebpackPlugin.prototype.generateAssetTags = function(assets) {
    var chunks = assets.chunks;
    var _filter  = function(path) {
        for(let key in chunks) {
            console.log(chunks[key], path);
            return chunks[key]['entry'] === path ? chunks[key] : null;
        }
    }

    // Turn script files into script tags
    var scripts = assets.js.map(function(scriptPath) {
        var chunk = _filter(scriptPath),
            script = chunk.script;

        if(script.inline) {
            return {
                tagName: 'script',
                closeTag: true,
                attributes: {

                }
            };
        }else {
            return {
                tagName: 'script',
                closeTag: true,
                attributes: {
                    type: 'text/javascript',
                    src: scriptPath
                }
            };
        }

    });
    // Make tags self-closing in case of xhtml
    var selfClosingTag = !!this.options.xhtml;
    // Turn css files into link tags
    var styles = assets.css.map(function(stylePath) {
        return {
            tagName: 'link',
            selfClosingTag: selfClosingTag,
            attributes: {
                href: stylePath,
                rel: 'stylesheet'
            }
        };
    });
    // Injection targets
    var head = [];
    var body = [];

    // If there is a favicon present, add it to the head
    if (assets.favicon) {
        head.push({
            tagName: 'link',
            selfClosingTag: selfClosingTag,
            attributes: {
                rel: 'shortcut icon',
                href: assets.favicon
            }
        });
    }
    // Add styles to the head
    head = head.concat(styles);
    // Add scripts to body or head
    if (this.options.inject === 'head') {
        head = head.concat(scripts);
    } else {
        body = body.concat(scripts);
    }
    return {
        head: head,
        body: body
    };
};

/**
 * Injects the assets into the given html string
 */
HtmlExtendWebpackPlugin.prototype.injectAssetsIntoHtml = function(html, assets, assetTags) {
    var htmlRegExp = /(<html[^>]*>)/i;
    var headRegExp = /(<\/head>)/i;
    var bodyRegExp = /(<\/body>)/i;
    var body = assetTags.body.map(this.createHtmlTag).join('');
    var head = assetTags.head.map(this.createHtmlTag).join('');

console.log(html);
    if(headRegExp.test(html)) {
        html = html.replace(headRegExp, head + '</head>');
    }else {
        html = head + html;
    }

    if(bodyRegExp.test(html)) {
        html = html.replace(bodyRegExp, body + '</body>');
    }else {
        html += body;
    }

    // if (body.length) {
    //     if (bodyRegExp.test(html)) {
    //         // Append assets to body element
    //         html = html.replace(bodyRegExp, function(match) {
    //             return body.join('') + match;
    //         });
    //     } else {
    //         // Append scripts to the end of the file if no <body> element exists:
    //         html += body.join('');
    //     }
    // }

    // if (head.length) {
    //     // Create a head tag if none exists
    //     if (!headRegExp.test(html)) {
    //         if (!htmlRegExp.test(html)) {
    //             html = '<head></head>' + html;
    //         } else {
    //             html = html.replace(htmlRegExp, function(match) {
    //                 return match + '<head></head>';
    //             });
    //         }
    //     }

    //     // Append assets to head element
    //     html = html.replace(headRegExp, function(match) {
    //         return head.join('') + match;
    //     });
    // }

    // Inject manifest into the opening html tag
    if (assets.manifest) {
        html = html.replace(/(<html[^>]*)(>)/i, function(match, start, end) {
            // Append the manifest only if no manifest was specified
            if (/\smanifest\s*=/.test(match)) {
                return match;
            }
            return start + ' manifest="' + assets.manifest + '"' + end;
        });
    }

    console.log(html);
    return html;
};

/**
 * Appends a cache busting hash
 */
HtmlExtendWebpackPlugin.prototype.appendHash = function(url, hash) {
    if (!url) {
        return url;
    }
    return url + (url.indexOf('?') === -1 ? '?' : '&') + hash;
};

/**
 * Turn a tag definition into a html string
 */
HtmlExtendWebpackPlugin.prototype.createHtmlTag = function(tagDefinition) {
    var attributes = Object.keys(tagDefinition.attributes || {}).map(function(attributeName) {
        return attributeName + '="' + tagDefinition.attributes[attributeName] + '"';
    });
    return '<' + [tagDefinition.tagName].concat(attributes).join(' ') + (tagDefinition.selfClosingTag ? '/' : '') + '>' +
        (tagDefinition.innerHTML || '') +
        (tagDefinition.closeTag ? '</' + tagDefinition.tagName + '>' : '');
};

/**
 * Helper to return the absolute template path with a fallback loader
 */
HtmlExtendWebpackPlugin.prototype.getFullTemplatePath = function(template, context) {
    // If the template doesn't use a loader use the lodash template loader
    if (template.indexOf('!') === -1) {
        template = require.resolve('./lib/loader.js') + '!' + path.resolve(context, template);
    }

    // Resolve template path
    // E:\workspace\vr-webpack-workspace\node_modules\html-webpack-plugin\lib\loader.js!E:\workspace\vr-webpack-workspace\src\jzwd\ksmap02\ksmap02.html
    return template.replace(
        /([!])([^\/\\][^!\?]+|[^\/\\!?])($|\?.+$)/,
        function(match, prefix, filepath, postfix) {
            return prefix + path.resolve(filepath) + postfix;
        });
};

/**
 * Helper to return a sorted unique array of all asset files out of the
 * asset object
 */
HtmlExtendWebpackPlugin.prototype.getAssetFiles = function(assets) {
    var files = _.uniq(Object.keys(assets).filter(function(assetType) {
        return assetType !== 'chunks' && assets[assetType];
    }).reduce(function(files, assetType) {
        return files.concat(assets[assetType]);
    }, []));
    files.sort();
    return files;
};

/**
 * Helper to promisify compilation.applyPluginsAsyncWaterfall that returns
 * a function that helps to merge given plugin arguments with processed ones
 */
HtmlExtendWebpackPlugin.prototype.applyPluginsAsyncWaterfall = function(compilation) {
    var promisedApplyPluginsAsyncWaterfall = Promise.promisify(compilation.applyPluginsAsyncWaterfall, {
        context: compilation
    });
    return function(eventName, requiresResult, pluginArgs) {
        return promisedApplyPluginsAsyncWaterfall(eventName, pluginArgs)
            .then(function(result) {
                if (requiresResult && !result) {
                    compilation.warnings.push(new Error('Using ' + eventName + ' without returning a result is deprecated.'));
                }
                return _.extend(pluginArgs, result);
            });
    };
};

module.exports = HtmlExtendWebpackPlugin;