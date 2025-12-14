import { db } from '@/database/index.ts';
import { users as usersTable } from '@/database/schema/users.ts';
import type { User } from "@/models/user.ts";
import type IUsersRepository from "../IUsersRepository.ts";
import { eq } from 'drizzle-orm';

export class DrizzleUsersRepository implements IUsersRepository {
  async findById(id: string): Promise<User | null> {
    const data = await db.select().from(usersTable).where(eq(usersTable.id, id));
    const user = data[0] || null;
    return user;
  }

  async findByPhone(phone: string): Promise<User | null> {
    const data = await db.select().from(usersTable).where(eq(usersTable.phone, phone));
    const user = data[0] || null;
    return user;
  }

  async create(phone: string, password: string, isAdmin: boolean): Promise<User> {
    const result = await db.insert(usersTable).values({ phone, password, isAdmin }).returning();
    const data = result[0];
    return data!;
  }

  async update(user: User): Promise<void> {
    await db.update(usersTable).set(user).where(eq(usersTable.id, user.id));
  }
}