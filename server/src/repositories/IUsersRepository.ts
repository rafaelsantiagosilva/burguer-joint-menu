import type { User } from "@/models/user.ts";

export default interface IUsersRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(email: string, password: string, isAdmin: boolean): Promise<User>;
  update(user: User): Promise<void>;
}