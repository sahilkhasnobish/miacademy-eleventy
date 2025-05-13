const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");
const markdownIt = require("markdown-it"); // ← This was missing

module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);


  eleventyConfig.setDataDeepMerge(true);


  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy");
  });


  eleventyConfig.addPlugin(syntaxHighlight);


  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));


  eleventyConfig.addPassthroughCopy("static");
  eleventyConfig.addPassthroughCopy("./src/admin/config.yml");
  eleventyConfig.addPassthroughCopy({
    "./node_modules/alpinejs/dist/cdn.min.js": "./static/js/alpine.js",
    "./node_modules/prismjs/themes/prism-tomorrow.css": "./static/css/prism-tomorrow.css",
  });
  eleventyConfig.addPassthroughCopy("./src/static/css/style.css");
  eleventyConfig.addPassthroughCopy("./src/static/img");
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (outputPath.endsWith(".html")) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    }
    return content;
  });


  const md = markdownIt();
  eleventyConfig.addFilter("markdown", function(value) {
    return md.render(value);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
  };
};
