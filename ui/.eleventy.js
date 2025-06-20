module.exports = function(eleventyConfig) {
  // Copy static files
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("logo");
  eleventyConfig.addPassthroughCopy("images");

  return {
    dir: {
      input: "src",
      includes: "includes",
      layouts: "layouts",
      output: "_site"
    }
  };
};
