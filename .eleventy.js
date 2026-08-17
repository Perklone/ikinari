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


// GitHub-style alerts: `> [!NOTE]`, `> [!WARNING]`, `> [!DANGER]`, with an
// optional custom label on the same line — `> [!WARNING] Don't do this`.
//
// Written as blockquotes so the source stays portable: on GitHub, in an
// editor preview, or in any other renderer they degrade to a quoted block
// rather than to broken syntax.
// Circle, triangle and cross are the universal semantic shapes AND the
// PlayStation face buttons, so the game reference costs nothing in clarity.
// Drawn XMB/Wii-style: thin uniform stroke, purely geometric, fully rounded
// joins, no fill — the era's look is the drawing, not the symbol.
const ICON = (paths) =>
    `<svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" ` +
    `stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

const CALLOUTS = {
    note:    { label: "NOTE",    icon: ICON('<circle cx="12" cy="12" r="9"/><path d="M12 11.2v5"/><path d="M12 7.6h.01"/>') },
    tip:     { label: "TIP",     icon: ICON('<circle cx="12" cy="12" r="9"/><path d="M12 11.2v5"/><path d="M12 7.6h.01"/>') },
    warning: { label: "WARNING", icon: ICON('<path d="M12 4.6 20.7 19.4H3.3z"/><path d="M12 10.2v4"/><path d="M12 17h.01"/>') },
    // Slightly heavier stroke: a bare mark reads lighter than the same weight
    // inside a circle or triangle, and this is the highest severity.
    danger:  { label: "DANGER",  icon: ICON('<g stroke-width="2.1"><path d="M6.4 6.4l11.2 11.2"/><path d="M17.6 6.4L6.4 17.6"/></g>') },
};

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const NEW_FOR_DAYS = 60;
const WORDS_PER_MINUTE = 200;
const CODE_PER_MINUTE  = 70;   // tokens/min — code is read, not skimmed

module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(syntaxHighlight);

    // ── Derived essay metadata ────────────────────────────────
    // Nothing below is declared in frontmatter, so nothing below can rot.
    // UTC accessors throughout: a date-only frontmatter value parses as
    // midnight UTC, and local getters would shift it a day west of Greenwich.

    // Code is read line by line, not skimmed, so counting it at prose speed
    // understates a technical post — the wrong direction to be wrong in on a
    // blog whose evidence is code.
    const countWords = (html) =>
        String(html || "").replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;

    eleventyConfig.addFilter("readingTime", (content) => {
        const html = String(content || "");
        const code = (html.match(/<pre[\s\S]*?<\/pre>/g) || []).reduce(
            (n, block) => n + countWords(block), 0
        );
        const prose = Math.max(0, countWords(html) - code);
        return Math.max(1, Math.ceil(prose / WORDS_PER_MINUTE + code / CODE_PER_MINUTE));
    });

    // 2026-03-02 -> "MAR 02, 2026"
    eleventyConfig.addFilter("postDate", (value) => {
        const d = new Date(value);
        const day = String(d.getUTCDate()).padStart(2, "0");
        return `${MONTHS[d.getUTCMonth()]} ${day}, ${d.getUTCFullYear()}`;
    });

    eleventyConfig.addFilter("year", (value) => new Date(value).getUTCFullYear());

    // Machine-readable dates for OG tags, the feed and the sitemap.
    eleventyConfig.addFilter("isoDate", (value) => new Date(value).toISOString());
    eleventyConfig.addFilter("rfc822", (value) => new Date(value).toUTCString());

    // Self-clearing: true for NEW_FOR_DAYS after publication, then false on
    // the next build. Never hand-set, so it cannot be left behind.
    eleventyConfig.addFilter("isNew", (value) => {
        const age = Date.now() - new Date(value).getTime();
        return age >= 0 && age < NEW_FOR_DAYS * 86400000;
    });

    // The opening paragraph, as a standalone summary. Matches the FIRST
    // attribute-less <p>, which skips the meta line, callout labels and
    // anything else that carries a class — so it lands on real prose.
    //
    // Derived rather than authored: an essay's first paragraph already has to
    // say what the piece is about, so a separate summary field would be a
    // second copy of the same sentence, free to drift. `description:` in
    // frontmatter overrides it when the opening does not stand alone.
    eleventyConfig.addFilter("excerpt", (content, max) => {
        const match = String(content || "").match(/<p>([\s\S]*?)<\/p>/);
        if (!match) return "";
        let text = match[1].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
        // Entities have to come back out, not just tags. `content` is rendered
        // HTML, so markdown has already turned & into &amp; — leave that in and
        // every consumer escapes it a second time: the index dek printed
        // "R&amp;D", and the feed shipped "R&amp;amp;D" to subscribers.
        // Returning true plain text lets each caller escape exactly once.
        // &amp; is decoded LAST, or "&amp;lt;" would collapse to "<" instead of
        // the literal "&lt;" the author wrote. Decoding before the cut also
        // keeps the character count honest — "&amp;" is five characters that
        // occupy one.
        text = text
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#0*39;|&apos;/g, "'")
            .replace(/&nbsp;/g, " ")
            .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
            .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)))
            .replace(/&amp;/g, "&");
        const limit = max || 180;
        if (text.length > limit) {
            let cut = text.slice(0, limit);
            cut = cut.slice(0, cut.lastIndexOf(" "));
            // Never end on a bare number: "p90 latency down 23…" severs the
            // value from its unit and reads as a typo rather than a cut.
            cut = cut.replace(/[\s(]+[\d.,]+$/, "");
            text = cut.replace(/[,;:.\-—]$/, "") + "…";
        }
        return text;
    });

    // Returns the essay for a slug, or null. Experience links an achievement
    // only when the writing actually exists — the page never promises a piece
    // that hasn't been published.
    eleventyConfig.addFilter("essayBySlug", (collection, slug) => {
        if (!slug || !collection) return null;
        return collection.find((post) => post.fileSlug === slug) || null;
    });

    eleventyConfig.addCollection("essay", (api) =>
        api.getFilteredByTag("essay").sort((a, b) => b.date - a.date)
    );

    eleventyConfig.addTransform("callouts", function (content) {
        if (!this.outputPath || !this.outputPath.endsWith(".html")) return content;
        return content.replace(
            /<blockquote>\s*<p>\[!(\w+)\]([^\n<]*)\n?([\s\S]*?)<\/blockquote>/g,
            (whole, rawType, rawLabel, body) => {
                const type = rawType.toLowerCase();
                const spec = CALLOUTS[type];
                if (!spec) return whole;                     // unknown: leave as a quote
                const label = (rawLabel || "").trim() || spec.label;
                return `<div class="callout is-${type}">` +
                       `<p class="callout-label">${spec.icon}<span>${label}</span></p>` +
                       `<p>${body.replace(/<\/p>\s*$/, "")}</p></div>`;
            }
        );
    });

    eleventyConfig.addPassthroughCopy("src/img");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/files");

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
