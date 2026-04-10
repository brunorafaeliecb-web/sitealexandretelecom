import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  contentSections,
  dynamicFields,
  editHistory,
  InsertContentSection,
  InsertDynamicField,
  ContentSection,
  DynamicField,
} from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Get all content sections
 */
export async function getAllContentSections(): Promise<ContentSection[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const sections = await db
      .select()
      .from(contentSections)
      .where(eq(contentSections.isVisible, true))
      .orderBy(contentSections.displayOrder);

    return sections;
  } catch (error) {
    console.error("[Database] Failed to get content sections:", error);
    return [];
  }
}

/**
 * Get a specific content section by key
 */
export async function getContentSectionByKey(
  sectionKey: string
): Promise<ContentSection | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db
      .select()
      .from(contentSections)
      .where(eq(contentSections.sectionKey, sectionKey))
      .limit(1);

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get content section:", error);
    return undefined;
  }
}

/**
 * Update content section
 */
export async function updateContentSection(
  sectionKey: string,
  content: Record<string, any>
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const result = await db
      .update(contentSections)
      .set({
        content: content as any,
        updatedAt: new Date(),
      })
      .where(eq(contentSections.sectionKey, sectionKey));

    return true;
  } catch (error) {
    console.error("[Database] Failed to update content section:", error);
    return false;
  }
}

/**
 * Create a new content section
 */
export async function createContentSection(
  data: InsertContentSection
): Promise<ContentSection | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  try {
    await db.insert(contentSections).values(data);
    return getContentSectionByKey(data.sectionKey);
  } catch (error) {
    console.error("[Database] Failed to create content section:", error);
    return undefined;
  }
}

/**
 * Get all dynamic fields for a section
 */
export async function getDynamicFieldsBySection(
  sectionId: number
): Promise<DynamicField[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const fields = await db
      .select()
      .from(dynamicFields)
      .where(eq(dynamicFields.sectionId, sectionId));

    return fields;
  } catch (error) {
    console.error("[Database] Failed to get dynamic fields:", error);
    return [];
  }
}

/**
 * Update a dynamic field
 */
export async function updateDynamicField(
  fieldId: number,
  value: string | null
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .update(dynamicFields)
      .set({
        fieldValue: value,
        updatedAt: new Date(),
      })
      .where(eq(dynamicFields.id, fieldId));

    return true;
  } catch (error) {
    console.error("[Database] Failed to update dynamic field:", error);
    return false;
  }
}

/**
 * Create a dynamic field
 */
export async function createDynamicField(
  data: InsertDynamicField
): Promise<DynamicField | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.insert(dynamicFields).values(data);
    const fields = await db
      .select()
      .from(dynamicFields)
      .where(eq(dynamicFields.id, result[0].insertId))
      .limit(1);

    return fields.length > 0 ? fields[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to create dynamic field:", error);
    return undefined;
  }
}

/**
 * Initialize default content sections
 */
export async function initializeDefaultSections(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const defaultSections: InsertContentSection[] = [
    {
      sectionKey: "navbar",
      sectionName: "Barra de Navegação",
      sectionType: "navbar",
      content: {
        logo: "MelhorPlano.net",
        menuItems: [
          { label: "Internet", href: "#internet" },
          { label: "Celular", href: "#celular" },
          { label: "TV e Streaming", href: "#streaming" },
          { label: "Operadoras", href: "#operadoras" },
        ],
        ctaText: "Cadastrar Provedor",
      },
      displayOrder: 0,
    },
    {
      sectionKey: "hero",
      sectionName: "Seção Hero",
      sectionType: "hero",
      content: {
        title: "Encontre a Melhor Oferta e Economize!",
        subtitle: "Compare planos de internet, celular, TV e combos no seu endereço.",
        buttonText: "Ver Planos",
        placeholder: "Digite seu CEP (ex: 01310-100)",
      },
      displayOrder: 1,
    },
    {
      sectionKey: "categories",
      sectionName: "Categorias",
      sectionType: "categories",
      content: {
        title: "Explore Serviços",
        categories: [
          { name: "Internet Residencial", icon: "wifi" },
          { name: "Planos de Celular", icon: "smartphone" },
          { name: "TV e Streaming", icon: "tv" },
          { name: "Combos", icon: "package" },
        ],
      },
      displayOrder: 2,
    },
    {
      sectionKey: "plans",
      sectionName: "Planos de Internet",
      sectionType: "plans",
      content: {
        title: "Melhores Planos de Internet",
        plans: [],
      },
      displayOrder: 3,
    },
    {
      sectionKey: "footer",
      sectionName: "Rodapé",
      sectionType: "footer",
      content: {
        copyright: "© 2024 MelhorPlano.net — Todos os direitos reservados",
        links: [
          { label: "Fatura", href: "#" },
          { label: "Atendimento", href: "#" },
          { label: "Portabilidade", href: "#" },
        ],
      },
      displayOrder: 99,
    },
  ];

  for (const section of defaultSections) {
    try {
      const existing = await getContentSectionByKey(section.sectionKey);
      if (!existing) {
        await createContentSection(section);
        console.log(`[Database] Created default section: ${section.sectionKey}`);
      }
    } catch (error) {
      console.error(`[Database] Failed to create default section ${section.sectionKey}:`, error);
    }
  }
}
