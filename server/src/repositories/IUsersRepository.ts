import type { User } from "@/models/user.ts";

export default interface IUsersRepository {
  findById(id: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  create(phone: string, password: string, isAdmin: boolean): Promise<User>;
  update(user: User): Promise<void>;
}