// Every spec imports `test`/`expect` from here (an ESLint rule enforces it) so suite-wide
// fixtures — auth helpers, a per-test DB handle, waits for streaming UI — have one home.
// Plain re-export for now; grow it into `base.extend({...})` when the first fixture lands.
export { test, expect } from "@playwright/test";
