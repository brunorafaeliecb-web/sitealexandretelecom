import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  createAdminRequest,
  getPendingAdminRequests,
  approveAdminRequest,
  rejectAdminRequest,
  getSiteSettings,
  getAllSiteSettings,
  upsertSiteSettings,
  getThemeSettings,
  updateThemeSettings,
} from "../db";
import { TRPCError } from "@trpc/server";

// Helper to check if user is admin
function ensureAdmin(userRole?: string) {
  if (userRole !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
}

export const adminRouter = router({
  // Request admin access
  requestAdminAccess: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

    try {
      await createAdminRequest(ctx.user.id, ctx.user.email || "", ctx.user.name || null);
      return { success: true, message: "Admin request submitted for approval" };
    } catch (error) {
      console.error("Error requesting admin access:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to submit admin request",
      });
    }
  }),

  // Get pending admin requests (admin only)
  getPendingRequests: protectedProcedure.query(async ({ ctx }) => {
    ensureAdmin(ctx.user?.role);

    try {
      return await getPendingAdminRequests();
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch pending requests",
      });
    }
  }),

  // Approve admin request (admin only)
  approveRequest: protectedProcedure
    .input(
      z.object({
        requestId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      ensureAdmin(ctx.user?.role);

      try {
        await approveAdminRequest(input.requestId, ctx.user!.id);
        return { success: true, message: "Admin request approved" };
      } catch (error) {
        console.error("Error approving request:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to approve request",
        });
      }
    }),

  // Reject admin request (admin only)
  rejectRequest: protectedProcedure
    .input(
      z.object({
        requestId: z.number(),
        reason: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      ensureAdmin(ctx.user?.role);

      try {
        await rejectAdminRequest(input.requestId, ctx.user!.id, input.reason);
        return { success: true, message: "Admin request rejected" };
      } catch (error) {
        console.error("Error rejecting request:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to reject request",
        });
      }
    }),

  // Get site settings for a section (public)
  getSiteSettings: publicProcedure
    .input(z.object({ section: z.string() }))
    .query(async ({ input }) => {
      try {
        return await getSiteSettings(input.section);
      } catch (error) {
        console.error("Error fetching site settings:", error);
        return null;
      }
    }),

  // Get all site settings (admin only)
  getAllSettings: protectedProcedure.query(async ({ ctx }) => {
    ensureAdmin(ctx.user?.role);

    try {
      return await getAllSiteSettings();
    } catch (error) {
      console.error("Error fetching all settings:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch settings",
      });
    }
  }),

  // Update site settings (admin only)
  updateSiteSettings: protectedProcedure
    .input(
      z.object({
        section: z.string(),
        content: z.unknown(),
        colors: z.unknown().optional(),
        images: z.unknown().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      ensureAdmin(ctx.user?.role);

      try {
        await upsertSiteSettings(
          input.section,
          input.content,
          input.colors,
          input.images,
          ctx.user!.id
        );
        return { success: true, message: "Settings updated successfully" };
      } catch (error) {
        console.error("Error updating settings:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update settings",
        });
      }
    }),

  // Get theme settings (public)
  getThemeSettings: publicProcedure.query(async () => {
    try {
      const settings = await getThemeSettings();
      return settings || {
        darkModeEnabled: false,
        primaryColor: "#00D4E8",
        secondaryColor: "#A855F7",
        backgroundColor: "#FAF8F5",
        darkBackgroundColor: "#0D1526",
      };
    } catch (error) {
      console.error("Error fetching theme settings:", error);
      return {
        darkModeEnabled: false,
        primaryColor: "#00D4E8",
        secondaryColor: "#A855F7",
        backgroundColor: "#FAF8F5",
        darkBackgroundColor: "#0D1526",
      };
    }
  }),

  // Update theme settings (admin only)
  updateThemeSettings: protectedProcedure
    .input(
      z.object({
        darkModeEnabled: z.boolean(),
        primaryColor: z.string().optional(),
        secondaryColor: z.string().optional(),
        backgroundColor: z.string().optional(),
        darkBackgroundColor: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      ensureAdmin(ctx.user?.role);

      try {
        await updateThemeSettings(
          input.darkModeEnabled,
          input.primaryColor,
          input.secondaryColor,
          input.backgroundColor,
          input.darkBackgroundColor,
          ctx.user!.id
        );
        return { success: true, message: "Theme updated successfully" };
      } catch (error) {
        console.error("Error updating theme:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update theme",
        });
      }
    }),
});
