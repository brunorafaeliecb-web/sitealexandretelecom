import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import type { User } from "../drizzle/schema";

type AdminUser = User & { role: "admin" };
type RegularUser = User;

function createAdminContext(): { ctx: TrpcContext; user: AdminUser } {
  const user: AdminUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx, user };
}

function createUserContext(): { ctx: TrpcContext; user: RegularUser } {
  const user: RegularUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx, user };
}

describe("admin router", () => {
  describe("requestAdminAccess", () => {
    it("should allow authenticated users to request admin access", async () => {
      const { ctx } = createUserContext();
      const caller = appRouter.createCaller(ctx);

      // This should succeed for authenticated users
      const result = await caller.admin.requestAdminAccess();
      expect(result.success).toBe(true);
    });
  });

  describe("getThemeSettings", () => {
    it("should return theme settings with valid colors", async () => {
      const ctx: TrpcContext = {
        user: null,
        req: {
          protocol: "https",
          headers: {},
        } as TrpcContext["req"],
        res: {
          clearCookie: () => {},
        } as TrpcContext["res"],
      };

      const caller = appRouter.createCaller(ctx);
      const result = await caller.admin.getThemeSettings();

      expect(result).toBeDefined();
      expect(result.primaryColor).toBe("#00D4E8");
      expect(result.secondaryColor).toBe("#A855F7");
      expect(result.backgroundColor).toBe("#FAF8F5");
      expect(result.darkBackgroundColor).toBe("#0D1526");
      expect(result.darkModeEnabled).toBeDefined();
    });
  });

  describe("getSiteSettings", () => {
    it("should return null for non-existent section", async () => {
      const ctx: TrpcContext = {
        user: null,
        req: {
          protocol: "https",
          headers: {},
        } as TrpcContext["req"],
        res: {
          clearCookie: () => {},
        } as TrpcContext["res"],
      };

      const caller = appRouter.createCaller(ctx);
      const result = await caller.admin.getSiteSettings({ section: "non-existent" });

      expect(result).toBeNull();
    });
  });

  describe("admin-only procedures", () => {
    it("should deny access to getPendingRequests for non-admin users", async () => {
      const { ctx } = createUserContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.admin.getPendingRequests();
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should deny access to updateThemeSettings for non-admin users", async () => {
      const { ctx } = createUserContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.admin.updateThemeSettings({ darkModeEnabled: true });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should allow admin users to access getPendingRequests", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // This should not throw
      const result = await caller.admin.getPendingRequests();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
