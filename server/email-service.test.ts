import { describe, it, expect, vi, beforeEach } from "vitest";
import { send2FACode, sendAdminApprovalEmail, sendAdminRejectionEmail } from "./email-service";

// Mock Resend
vi.mock("resend", () => {
  const mockResend = {
    emails: {
      send: vi.fn(),
    },
  };
  return {
    Resend: vi.fn(() => mockResend),
  };
});

describe("Email Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should send 2FA code successfully", async () => {
    const { Resend } = await import("resend");
    const mockInstance = new Resend("test-key");
    
    (mockInstance.emails.send as any).mockResolvedValue({
      data: { id: "email-123" },
      error: null,
    });

    const result = await send2FACode("test@example.com", "123456", "John");
    
    expect(result).toBe(true);
    expect(mockInstance.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "test@example.com",
        subject: expect.stringContaining("código de autenticação"),
      })
    );
  });

  it("should send approval email successfully", async () => {
    const { Resend } = await import("resend");
    const mockInstance = new Resend("test-key");
    
    (mockInstance.emails.send as any).mockResolvedValue({
      data: { id: "email-456" },
      error: null,
    });

    const result = await sendAdminApprovalEmail(
      "admin@example.com",
      "Jane",
      "https://example.com/admin"
    );
    
    expect(result).toBe(true);
    expect(mockInstance.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "admin@example.com",
        subject: expect.stringContaining("aprovada"),
      })
    );
  });

  it("should send rejection email successfully", async () => {
    const { Resend } = await import("resend");
    const mockInstance = new Resend("test-key");
    
    (mockInstance.emails.send as any).mockResolvedValue({
      data: { id: "email-789" },
      error: null,
    });

    const result = await sendAdminRejectionEmail(
      "user@example.com",
      "Bob",
      "Não atende aos critérios"
    );
    
    expect(result).toBe(true);
    expect(mockInstance.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "user@example.com",
        subject: expect.stringContaining("revisada"),
      })
    );
  });

  it("should handle email send errors", async () => {
    const { Resend } = await import("resend");
    const mockInstance = new Resend("test-key");
    
    (mockInstance.emails.send as any).mockResolvedValue({
      error: { message: "Invalid email" },
    });

    const result = await send2FACode("invalid", "123456");
    
    expect(result).toBe(false);
  });

  it("should handle network errors", async () => {
    const { Resend } = await import("resend");
    const mockInstance = new Resend("test-key");
    
    (mockInstance.emails.send as any).mockRejectedValue(
      new Error("Network error")
    );

    const result = await send2FACode("test@example.com", "123456");
    
    expect(result).toBe(false);
  });
});
