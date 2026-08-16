const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

// Nice names for the header strip. Anything unlisted falls back to the
// fence's own language token, uppercased by CSS.
const LANG_LABEL = {
    js: "JavaScript", jsx: "JSX", ts: "TypeScript", tsx: "TSX",
    rb: "Ruby", ruby: "Ruby", erb: "ERB",
    go: "Go", rs: "Rust", py: "Python", python: "Python",
    java: "Java", kt: "Kotlin", swift: "Swift", objc: "Objective-C",
    scala: "Scala", sh: "Shell", bash: "Shell", zsh: "Shell",
    yml: "YAML", yaml: "YAML", json: "JSON", toml: "TOML",
    sql: "SQL", html: "HTML", css: "CSS", scss: "SCSS",
    diff: "Diff", dockerfile: "Dockerfile", makefile: "Makefile",
    text: "Text", plain: "Text",
};

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(syntaxHighlight);
    eleventyConfig.addPassthroughCopy("src/img");
    eleventyConfig.addPassthroughCopy("src/js");

    // Tailwind inlines @fontsource's @font-face rules but leaves their
    // url(./files/…) references dangling. Copy the two weights we load to
    // sit beside the compiled stylesheet.
    eleventyConfig.addPassthroughCopy({
        "node_modules/@fontsource/geist-mono/files/geist-mono-latin-400-normal.woff2": "css/files/geist-mono-latin-400-normal.woff2",
        "node_modules/@fontsource/geist-mono/files/geist-mono-latin-400-normal.woff": "css/files/geist-mono-latin-400-normal.woff",
        "node_modules/@fontsource/geist-mono/files/geist-mono-latin-500-normal.woff2": "css/files/geist-mono-latin-500-normal.woff2",
        "node_modules/@fontsource/geist-mono/files/geist-mono-latin-500-normal.woff": "css/files/geist-mono-latin-500-normal.woff",
    });

    // Wrap every fenced block in a figure with a header strip.
    //
    //   ```ruby                      -> label only
    //   ```ruby:config/boot.rb       -> label + filename
    //   ```js/1-3:server.js          -> line highlighting still works
    //
    // The filename is stripped from token.info before delegating, so the
    // highlighter only ever sees the language and its line numbers.
    eleventyConfig.amendLibrary("md", (md) => {
        const defaultFence = md.renderer.rules.fence;

        md.renderer.rules.fence = function(tokens, idx, options, env, self) {
            const token = tokens[idx];
            const raw = (token.info || "").trim();

            const colon = raw.indexOf(":");
            let filename = "";
            if (colon !== -1) {
                filename = raw.slice(colon + 1).trim();
                token.info = raw.slice(0, colon);
            }

            const html = defaultFence(tokens, idx, options, env, self);

            const lang = (token.info || "").split("/")[0].split(" ")[0].toLowerCase() || "text";
            const label = LANG_LABEL[lang] || lang;

            const file = filename
                ? `<span class="code-file">${escapeHtml(filename)}</span>`
                : "";

            return `<figure class="code-block" data-lang="${escapeHtml(lang)}">` +
                   `<figcaption class="code-head">` +
                   `<span class="code-lang">${escapeHtml(label)}</span>${file}` +
                   `</figcaption>${html}</figure>`;
        };
    });

    return {
        dir: { input: 'src', output: '_site' }
    };
};
