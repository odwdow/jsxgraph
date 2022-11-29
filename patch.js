module.exports = {
    files: "distrib/jsxgraphsrc.js",
    from: [/\(self,/,
           // /module.exports = factory\(require\("canvas"\)\);/,
           /return __webpack_exports__;/,
           /\["canvas"\], factory/,
           /\] = factory\(require\("canvas"\)\);/,
           /factory\(root\["canvas"\]\)/
        ],
    to: ["(typeof self !== 'undefined' ? self : this,",
         // "module.exports = factory(require('canvas')).default;",
         "return __webpack_exports__.default;",
         "[], factory",
         "] = factory();",
         "factory()"
        ]
};