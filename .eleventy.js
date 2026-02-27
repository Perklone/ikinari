const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(syntaxHighlight);
    eleventyConfig.addPassthroughCopy("src/img");
    eleventyConfig.addPassthroughCopy("src/js");

    // Wrap tables in scrollable container for mobile
    eleventyConfig.addTransform("tableWrapper", function(content) {
        if (this.outputPath && this.outputPath.endsWith(".html")) {
            content = content.replace(/<table/g, '<div class="table-wrapper"><table');
            content = content.replace(/<\/table>/g, '</table></div>');
        }
        return content;
    });

    eleventyConfig.addFilter("postDate", (dateObj) => {
        const d = new Date(dateObj);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}.${m}.${day}`;
    });

    return {
        dir: { input: 'src', output: '_site' }
    };
};