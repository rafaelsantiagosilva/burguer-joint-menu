import type { users } from "@/database/schema/users.ts";

export type User = typeof users.$inferSelect;