import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, adminRequests, siteSettings, themeSettings, editHistory, twoFactorCodes, userTwoFactorSettings, cepSearchHistory, CEPSearchHistory, InsertCEPSearchHistory, AdminRequest, SiteSetting, ThemeSetting, EditHistory, InsertEditHistory, TwoFactorCode, InsertTwoFactorCode, UserTwoFactorSettings, InsertUserTwoFactorSettings } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Admin Request helpers
export async function createAdminRequest(userId: number, email: string, name: string | null) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(adminRequests).values({
    userId,
    email,
    name,
    status: "pending",
  });
}

export async function getPendingAdminRequests() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(adminRequests).where(eq(adminRequests.status, "pending"));
}

export async function approveAdminRequest(requestId: number, approverId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const request = await db.select().from(adminRequests).where(eq(adminRequests.id, requestId)).limit(1);
  if (!request[0]) throw new Error("Admin request not found");

  await db.update(adminRequests)
    .set({
      status: "approved",
      approvedBy: approverId,
      approvedAt: new Date(),
    })
    .where(eq(adminRequests.id, requestId));

  // Promote user to admin
  await db.update(users)
    .set({ role: "admin" })
    .where(eq(users.id, request[0].userId));
}

export async function rejectAdminRequest(requestId: number, approverId: number, reason: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(adminRequests)
    .set({
      status: "rejected",
      approvedBy: approverId,
      approvedAt: new Date(),
      rejectionReason: reason,
    })
    .where(eq(adminRequests.id, requestId));
}

// Site Settings helpers
export async function getSiteSettings(section: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(siteSettings).where(eq(siteSettings.section, section)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAllSiteSettings() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(siteSettings);
}

export async function upsertSiteSettings(section: string, content: unknown, colors?: unknown, images?: unknown, updatedBy?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getSiteSettings(section);

  if (existing) {
    await db.update(siteSettings)
      .set({
        content,
        colors: colors || existing.colors,
        images: images || existing.images,
        updatedBy,
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.section, section));
  } else {
    await db.insert(siteSettings).values({
      section,
      content,
      colors,
      images,
      updatedBy,
    });
  }
}

// Theme Settings helpers
export async function getThemeSettings() {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(themeSettings).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateThemeSettings(
  darkModeEnabled: boolean,
  primaryColor?: string,
  secondaryColor?: string,
  backgroundColor?: string,
  darkBackgroundColor?: string,
  updatedBy?: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getThemeSettings();

  const updateData: Partial<ThemeSetting> = {
    darkModeEnabled,
    updatedBy,
    updatedAt: new Date(),
  };

  if (primaryColor) updateData.primaryColor = primaryColor;
  if (secondaryColor) updateData.secondaryColor = secondaryColor;
  if (backgroundColor) updateData.backgroundColor = backgroundColor;
  if (darkBackgroundColor) updateData.darkBackgroundColor = darkBackgroundColor;

  if (existing) {
    await db.update(themeSettings).set(updateData).limit(1);
  } else {
    await db.insert(themeSettings).values({
      darkModeEnabled,
      primaryColor: primaryColor || "#00D4E8",
      secondaryColor: secondaryColor || "#A855F7",
      backgroundColor: backgroundColor || "#FAF8F5",
      darkBackgroundColor: darkBackgroundColor || "#0D1526",
      updatedBy,
    });
  }
}

// Edit History helpers
export async function logEdit(
  section: string,
  userId: number,
  userName: string | null,
  userEmail: string | null,
  changeType: "create" | "update" | "delete",
  oldValue: unknown,
  newValue: unknown,
  description?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(editHistory).values({
    section,
    userId,
    userName,
    userEmail,
    changeType,
    oldValue,
    newValue,
    description,
  });
}

export async function getEditHistory(section?: string) {
  const db = await getDb();
  if (!db) return [];

  if (section) {
    return db.select().from(editHistory).where(eq(editHistory.section, section)).orderBy(editHistory.createdAt);
  }
  return db.select().from(editHistory).orderBy(editHistory.createdAt);
}

// 2FA helpers
export async function generateTwoFactorCode(userId: number, email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const code = Math.random().toString().slice(2, 8).padStart(6, "0");
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await db.insert(twoFactorCodes).values({
    userId,
    code,
    email,
    expiresAt,
  });

  return code;
}

export async function verifyTwoFactorCode(userId: number, code: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(twoFactorCodes)
    .where(
      and(
        eq(twoFactorCodes.userId, userId),
        eq(twoFactorCodes.code, code),
        eq(twoFactorCodes.isUsed, false)
      )
    )
    .limit(1);

  if (!result[0]) return false;

  const now = new Date();
  if (result[0].expiresAt < now) {
    return false; // Code expired
  }

  // Mark code as used
  await db
    .update(twoFactorCodes)
    .set({ isUsed: true })
    .where(eq(twoFactorCodes.id, result[0].id));

  return true;
}

export async function getUserTwoFactorSettings(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(userTwoFactorSettings)
    .where(eq(userTwoFactorSettings.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function enableTwoFactor(userId: number, email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getUserTwoFactorSettings(userId);

  if (existing) {
    await db
      .update(userTwoFactorSettings)
      .set({
        twoFactorEnabled: true,
        verifiedEmail: email,
      })
      .where(eq(userTwoFactorSettings.userId, userId));
  } else {
    await db.insert(userTwoFactorSettings).values({
      userId,
      twoFactorEnabled: true,
      twoFactorMethod: "email",
      verifiedEmail: email,
    });
  }
}

export async function disableTwoFactor(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(userTwoFactorSettings)
    .set({ twoFactorEnabled: false })
    .where(eq(userTwoFactorSettings.userId, userId));
}

// TODO: add feature queries here as your schema grows.

// CEP Search History helpers
export async function saveCEPSearch(data: InsertCEPSearchHistory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(cepSearchHistory).values(data);
}

export async function getCEPSearchHistory(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(cepSearchHistory).orderBy(cepSearchHistory.createdAt).limit(limit);
}

export async function getCEPSearchByRegion(regiao: string) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(cepSearchHistory).where(eq(cepSearchHistory.regiao, regiao));
}

export async function getCEPSearchStats() {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(cepSearchHistory);
  return result;
}
