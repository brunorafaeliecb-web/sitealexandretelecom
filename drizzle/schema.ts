import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json, datetime } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Admin access requests - users requesting admin access
 */
export const adminRequests = mysqlTable("admin_requests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  name: text("name"),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  approvedBy: int("approvedBy"),
  approvedAt: timestamp("approvedAt"),
  rejectionReason: text("rejectionReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminRequest = typeof adminRequests.$inferSelect;
export type InsertAdminRequest = typeof adminRequests.$inferInsert;

/**
 * Site settings and content - editable by admins
 */
export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  section: varchar("section", { length: 100 }).notNull().unique(),
  content: json("content").notNull(),
  colors: json("colors"),
  images: json("images"),
  updatedBy: int("updatedBy"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

/**
 * Global theme settings
 */
export const themeSettings = mysqlTable("theme_settings", {
  id: int("id").autoincrement().primaryKey(),
  darkModeEnabled: boolean("darkModeEnabled").default(false).notNull(),
  primaryColor: varchar("primaryColor", { length: 7 }).default("#00D4E8").notNull(),
  secondaryColor: varchar("secondaryColor", { length: 7 }).default("#A855F7").notNull(),
  backgroundColor: varchar("backgroundColor", { length: 7 }).default("#FAF8F5").notNull(),
  darkBackgroundColor: varchar("darkBackgroundColor", { length: 7 }).default("#0D1526").notNull(),
  updatedBy: int("updatedBy"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ThemeSetting = typeof themeSettings.$inferSelect;
export type InsertThemeSetting = typeof themeSettings.$inferInsert;

/**
 * Edit history - track all changes to site settings
 */
export const editHistory = mysqlTable("edit_history", {
  id: int("id").autoincrement().primaryKey(),
  section: varchar("section", { length: 100 }).notNull(),
  userId: int("userId").notNull(),
  userName: text("userName"),
  userEmail: varchar("userEmail", { length: 320 }),
  changeType: mysqlEnum("changeType", ["create", "update", "delete"]).notNull(),
  oldValue: json("oldValue"),
  newValue: json("newValue"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EditHistory = typeof editHistory.$inferSelect;
export type InsertEditHistory = typeof editHistory.$inferInsert;

/**
 * 2FA codes - for email-based two-factor authentication
 */
export const twoFactorCodes = mysqlTable("two_factor_codes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  isUsed: boolean("isUsed").default(false).notNull(),
  expiresAt: datetime("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TwoFactorCode = typeof twoFactorCodes.$inferSelect;
export type InsertTwoFactorCode = typeof twoFactorCodes.$inferInsert;

/**
 * User 2FA settings
 */
export const userTwoFactorSettings = mysqlTable("user_two_factor_settings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  twoFactorEnabled: boolean("twoFactorEnabled").default(false).notNull(),
  twoFactorMethod: mysqlEnum("twoFactorMethod", ["email"]).default("email").notNull(),
  verifiedEmail: varchar("verifiedEmail", { length: 320 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserTwoFactorSettings = typeof userTwoFactorSettings.$inferSelect;
export type InsertUserTwoFactorSettings = typeof userTwoFactorSettings.$inferInsert;

// TODO: Add your tables here
/**
 * Dynamic content sections - stores all editable sections of the website
 */
export const contentSections = mysqlTable("content_sections", {
  id: int("id").autoincrement().primaryKey(),
  sectionKey: varchar("sectionKey", { length: 255 }).notNull().unique(),
  sectionName: varchar("sectionName", { length: 255 }).notNull(),
  sectionType: mysqlEnum("sectionType", [
    "hero",
    "categories",
    "plans",
    "celular",
    "streaming",
    "providers",
    "award",
    "howItWorks",
    "whyUs",
    "links",
    "cta",
    "footer",
    "navbar",
  ]).notNull(),
  content: json("content").notNull(),
  isVisible: boolean("isVisible").default(true).notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContentSection = typeof contentSections.$inferSelect;
export type InsertContentSection = typeof contentSections.$inferInsert;

/**
 * Dynamic fields - flexible field definitions for each section
 */
export const dynamicFields = mysqlTable("dynamic_fields", {
  id: int("id").autoincrement().primaryKey(),
  sectionId: int("sectionId").notNull(),
  fieldKey: varchar("fieldKey", { length: 255 }).notNull(),
  fieldLabel: varchar("fieldLabel", { length: 255 }).notNull(),
  fieldType: mysqlEnum("fieldType", [
    "text",
    "textarea",
    "number",
    "color",
    "image",
    "url",
    "email",
    "select",
    "boolean",
    "json",
  ]).notNull(),
  fieldValue: text("fieldValue"),
  fieldOptions: json("fieldOptions"),
  isRequired: boolean("isRequired").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DynamicField = typeof dynamicFields.$inferSelect;
export type InsertDynamicField = typeof dynamicFields.$inferInsert;

/**
 * CEP Search History - armazena histórico de buscas por CEP
 * Útil para análises de regiões com mais interesse
 */
export const cepSearchHistory = mysqlTable("cep_search_history", {
  id: int("id").autoincrement().primaryKey(),
  cep: varchar("cep", { length: 10 }).notNull(),
  logradouro: text("logradouro"),
  bairro: varchar("bairro", { length: 100 }),
  localidade: varchar("localidade", { length: 100 }), // Cidade
  uf: varchar("uf", { length: 2 }), // Estado
  regiao: varchar("regiao", { length: 50 }), // Região (Sudeste, etc)
  ddd: varchar("ddd", { length: 3 }), // Código de área
  ibge: varchar("ibge", { length: 10 }), // Código IBGE
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CEPSearchHistory = typeof cepSearchHistory.$inferSelect;
export type InsertCEPSearchHistory = typeof cepSearchHistory.$inferInsert;
