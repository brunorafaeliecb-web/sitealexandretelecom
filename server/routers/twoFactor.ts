import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { send2FACode } from "../email-service";
import { protectedProcedure, router } from "../_core/trpc";
import {
  generateTwoFactorCode,
  verifyTwoFactorCode,
  getUserTwoFactorSettings,
  enableTwoFactor,
  disableTwoFactor,
  getEditHistory,
  logEdit,
} from "../db";

export const twoFactorRouter = router({
  // Enable 2FA for current user
  enable: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      try {
        // Generate and send code via Resend
        const code = await generateTwoFactorCode(ctx.user.id, input.email);
        const emailSent = await send2FACode(input.email, code, ctx.user.name || "User");

        if (!emailSent) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to send verification code. Please try again.",
          });
        }

        return {
          success: true,
          message: "Verification code sent to your email. It expires in 10 minutes.",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Error enabling 2FA:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to enable 2FA",
        });
      }
    }),

  // Verify 2FA code and enable it
  verify: protectedProcedure
    .input(z.object({ code: z.string().length(6) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      try {
        const isValid = await verifyTwoFactorCode(ctx.user.id, input.code);

        if (!isValid) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid or expired code",
          });
        }

        // Enable 2FA for user
        await enableTwoFactor(ctx.user.id, ctx.user.email || "");

        return {
          success: true,
          message: "Two-factor authentication enabled successfully",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Error verifying 2FA:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to verify code",
        });
      }
    }),

  // Disable 2FA
  disable: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

    try {
      await disableTwoFactor(ctx.user.id);
      return {
        success: true,
        message: "Two-factor authentication disabled",
      };
    } catch (error) {
      console.error("Error disabling 2FA:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to disable 2FA",
      });
    }
  }),

  // Get 2FA settings
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

    try {
      const settings = await getUserTwoFactorSettings(ctx.user.id);
      return settings || {
        twoFactorEnabled: false,
        twoFactorMethod: "email",
        verifiedEmail: null,
      };
    } catch (error) {
      console.error("Error fetching 2FA settings:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch 2FA settings",
      });
    }
  }),
});

export const editHistoryRouter = router({
  // Get edit history (admin only)
  getHistory: protectedProcedure
    .input(z.object({ section: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      try {
        return await getEditHistory(input.section);
      } catch (error) {
        console.error("Error fetching edit history:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch edit history",
        });
      }
    }),

  // Log an edit
  logEdit: protectedProcedure
    .input(
      z.object({
        section: z.string(),
        changeType: z.enum(["create", "update", "delete"]),
        oldValue: z.unknown().optional(),
        newValue: z.unknown().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      try {
        await logEdit(
          input.section,
          ctx.user.id,
          ctx.user.name || null,
          ctx.user.email || null,
          input.changeType,
          input.oldValue,
          input.newValue,
          input.description
        );

        return {
          success: true,
          message: "Edit logged successfully",
        };
      } catch (error) {
        console.error("Error logging edit:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to log edit",
        });
      }
    }),
});
