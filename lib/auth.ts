import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      console.log(`[RESET PASSWORD LINK FOR ${user.email}]: ${url}`);
      try {
        const fs = require("fs");
        const path = require("path");
        const filePath = path.join(process.cwd(), "reset_password_link.txt");
        fs.writeFileSync(
          filePath,
          `User: ${user.email}\nReset Link: ${url}\nToken: ${token}\nTimestamp: ${new Date().toISOString()}\n`
        );
      } catch (err) {
        console.error("Failed to write reset link to file:", err);
      }
    },
  },
});