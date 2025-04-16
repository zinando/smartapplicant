module.exports = function(eleventyConfig) {
  // Copy static files
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("logo");

  return {
    dir: {
      input: "src",
      includes: "includes",
      layouts: "layouts",
      output: "_site"
    }
  };
};
