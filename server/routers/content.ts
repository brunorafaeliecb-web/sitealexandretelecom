import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getAllContentSections,
  getContentSectionByKey,
  updateContentSection,
  createContentSection,
  getDynamicFieldsBySection,
  updateDynamicField,
  initializeDefaultSections,
} from "../db-content";
import { logEdit } from "../db";
import { TRPCError } from "@trpc/server";

export const contentRouter = router({
  // Get all content sections (public)
  getAllSections: publicProcedure.query(async () => {
    try {
      const sections = await getAllContentSections();
      return sections;
    } catch (error) {
      console.error("Error fetching content sections:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch content sections",
      });
    }
  }),

  // Get a specific section by key (public)
  getSectionByKey: publicProcedure
    .input(z.object({ sectionKey: z.string() }))
    .query(async ({ input }) => {
      try {
        const section = await getContentSectionByKey(input.sectionKey);
        return section;
      } catch (error) {
        console.error("Error fetching content section:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch content section",
        });
      }
    }),

  // Update section content (admin only)
  updateSection: protectedProcedure
    .input(
      z.object({
        sectionKey: z.string(),
        content: z.record(z.string(), z.unknown()),
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
        // Get old value for history
        const oldSection = await getContentSectionByKey(input.sectionKey);

        // Update the section
        const success = await updateContentSection(input.sectionKey, input.content);

        if (!success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update section",
          });
        }

        // Log the edit
        await logEdit(
          input.sectionKey,
          ctx.user.id,
          ctx.user.name || null,
          ctx.user.email || null,
          "update",
          oldSection?.content as unknown,
          input.content as unknown,
          input.description || `Updated ${input.sectionKey} section`
        );

        return {
          success: true,
          message: "Section updated successfully",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Error updating section:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update section",
        });
      }
    }),

  // Get dynamic fields for a section (admin only)
  getDynamicFields: protectedProcedure
    .input(z.object({ sectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      try {
        const fields = await getDynamicFieldsBySection(input.sectionId);
        return fields;
      } catch (error) {
        console.error("Error fetching dynamic fields:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch dynamic fields",
        });
      }
    }),

  // Update a dynamic field (admin only)
  updateDynamicField: protectedProcedure
    .input(
      z.object({
        fieldId: z.number(),
        value: z.string().nullable(),
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
        const success = await updateDynamicField(input.fieldId, input.value);

        if (!success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update field",
          });
        }

        // Log the edit
        await logEdit(
          `field_${input.fieldId}`,
          ctx.user.id,
          ctx.user.name || null,
          ctx.user.email || null,
          "update",
          null as unknown,
          { value: input.value } as unknown,
          input.description || "Updated dynamic field"
        );

        return {
          success: true,
          message: "Field updated successfully",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Error updating dynamic field:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update field",
        });
      }
    }),

  // Initialize default sections (admin only, one-time setup)
  initializeDefaults: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Admin access required",
      });
    }

    try {
      await initializeDefaultSections();
      return {
        success: true,
        message: "Default sections initialized",
      };
    } catch (error) {
      console.error("Error initializing defaults:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to initialize defaults",
      });
    }
  }),
});
