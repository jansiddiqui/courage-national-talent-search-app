/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AuthUser {
  cntsId?: string;
  email?: string;
  phoneNumber?: string;
  role: string;
  isAuthenticated: boolean;
}

class AuthService {
  /**
   * Log in with CNTS ID and Date of Birth
   */
  public async loginWithCredentials(
    cntsId: string,
    dob: string
  ): Promise<{ success: boolean; message: string; role?: string }> {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cntsId, dob })
      });
      const data = await res.json();
      return data;
    } catch (e: any) {
      console.error("[AuthService] login error:", e);
      return { success: false, message: e.message || "Network error. Please try again." };
    }
  }

  /**
   * Request magic login link via email
   */
  public async sendEmailLink(email: string): Promise<{ success: boolean; message: string; sandboxLink?: string }> {
    try {
      const res = await fetch("/api/auth/send-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      return data;
    } catch (e: any) {
      console.error("[AuthService] magic link error:", e);
      return { success: false, message: e.message || "Network error. Please try again." };
    }
  }

  /**
   * Request Forgot CNTS ID WhatsApp recovery
   */
  public async forgotCNTSId(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch("/api/auth/forgot-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber })
      });
      const data = await res.json();
      return data;
    } catch (e: any) {
      console.error("[AuthService] forgot id error:", e);
      return { success: false, message: e.message || "Network error. Please try again." };
    }
  }

  /**
   * Ends the parent/admin session and clears session cookies
   */
  public async logout(): Promise<boolean> {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST"
      });
      return res.ok;
    } catch (e) {
      console.error("[AuthService] logout error:", e);
      return false;
    }
  }

  /**
   * Checks the active session state of the user
   */
  public async checkSession(): Promise<AuthUser> {
    try {
      const res = await fetch("/api/auth/session");
      if (!res.ok) {
        return { isAuthenticated: false, role: "PARENT" };
      }
      return await res.json();
    } catch (e) {
      console.error("[AuthService] checkSession error:", e);
      return { isAuthenticated: false, role: "PARENT" };
    }
  }
}

export const authService = new AuthService();
