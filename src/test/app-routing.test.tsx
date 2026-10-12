import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering; loaders may need a server or network.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(matches.some((match) => match.routeId === "/_public")).toBe(true);
  });

  it("keeps admin routes inside the admin layout and outside the public layout", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/admin");
    const routeIds = matches.map((match) => match.routeId);

    expect(routeIds).toContain("/_admin");
    expect(routeIds).not.toContain("/_public");
    expect(matches.at(-1)?.routeId).toBe("/_admin/admin");
  });

  it("keeps public pages inside the public layout and outside the admin layout", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/about");
    const routeIds = matches.map((match) => match.routeId);

    expect(routeIds).toContain("/_public");
    expect(routeIds).not.toContain("/_admin");
    expect(matches.at(-1)?.routeId).toBe("/_public/about");
  });
});
