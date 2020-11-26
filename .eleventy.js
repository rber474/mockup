// const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
// module.exports = function(eleventyConfig) {
//   eleventyConfig.addPlugin(eleventyNavigationPlugin);
// };


module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({"src/pat": "pat"});
  eleventyConfig.addPassthroughCopy({"favicon.ico": "favicon.ico"});
  eleventyConfig.addPassthroughCopy({"docs/main.css": "main.css"});
  eleventyConfig.addPassthroughCopy({"dist": "dist"});
  // eleventyConfig.addPassthroughCopy({"mockup/tests/fakeserver.js": "mockup/build/fakeserver.js"});
  eleventyConfig.addPassthroughCopy({"node_modules/bootstrap": "dist/bootstrap"});
  // eleventyConfig.addPassthroughCopy({"mockup/node_modules/requirejs/require.js": "mockup/build/require.js"});
  // eleventyConfig.addPassthroughCopy({"mockup/node_modules/sinon/pkg/sinon.js": "mockup/build/sinon.js"});
  // eleventyConfig.addPassthroughCopy({"mockup/node_modules/sinon/pkg/sinon-esm.js": "mockup/build/sinon-esm.js"});
  //eleventyConfig.addPassthroughCopy("mockup/patterns/**/*.json");
  //eleventyConfig.addPassthroughCopy({"../mockup/js/bundles": "js/bundles"});
  //eleventyConfig.addPassthroughCopy({"../mockup/js/config.js": "js/config.js"});
  //eleventyConfig.addPassthroughCopy({"../mockup/js/patterns": "patterns"});
  //eleventyConfig.addPassthroughCopy({"../mockup/node_modules": "node_modules"});

  // Filter source file names using a glob
  eleventyConfig.addCollection("patterns", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/pat/**/README.md");
  });

  eleventyConfig.addLiquidFilter("replaceString", function(arg1, arg2, arg3) {
    return arg1.replace(arg2, arg3);
  });

  eleventyConfig["dir"] = {
      input: "./",
      ouput: "docs/_site",
      includes: "docs/_includes",
      data: "docs/_data"
  };
  return eleventyConfig;
};
