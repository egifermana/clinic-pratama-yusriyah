// default open-next.config.ts file created by @opennextjs/cloudflare
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
// import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

const config = defineCloudflareConfig({
	// For best results consider enabling R2 caching
	// See https://opennext.js.org/cloudflare/caching for more details
	// incrementalCache: r2IncrementalCache
});

// defineCloudflareConfig() doesn't forward arbitrary OpenNextConfig keys
// (like buildCommand), so it must be set on the returned object directly.
// "build" runs `opennextjs-cloudflare build` (required by Cloudflare's
// fixed build command); point the internal Next.js compile step at
// build:next instead, or it would recurse into itself forever.
config.buildCommand = "npm run build:next";

export default config;
