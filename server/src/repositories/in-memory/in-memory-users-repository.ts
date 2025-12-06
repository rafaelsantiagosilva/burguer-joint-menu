import type { User } from "@/models/user.ts";
import type IUsersRepository from "../IUsersRepository.ts";

export class InMemoryUsersRepository implements IUsersRepository {
  public users: User[] = [];

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id) || null;
    return user;
  }

  async findByPhone(phone: string): Promise<User | null> {
    const user = this.users.find((user) => user.phone === phone) || null;
    return user;
  }

  async create(phone: string, password: string, isAdmin: boolean): Promise<User> {
    const newUser: User = {
      id: crypto.randomUUID(),
      name: null,
      phone,
      password,
      address: null,
      isAdmin,
    }

    this.users.push(newUser);
    return newUser;
  }

  async update(user: User): Promise<void> {
    const userIndex = this.users.findIndex((u) => u.id === user.id);

    if (userIndex >= 0)
      this.users[userIndex] = user;
  }
}