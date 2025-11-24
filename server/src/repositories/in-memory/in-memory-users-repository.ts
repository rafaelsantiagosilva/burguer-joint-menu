import type { User } from "@/models/user.ts";
import type IUsersRepository from "../IUsersRepository.ts";

export class InMemoryUsersRepository implements IUsersRepository {
  public users: User[] = [];

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id) || null;
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email) || null;
    return user;
  }

  async create(email: string, password: string, isAdmin: boolean): Promise<User> {
    const newUser: User = {
      id: crypto.randomUUID(),
      name: null,
      email,
      password,
      address: null,
      isAdmin,
    }

    this.users.push(newUser);
    return newUser;
  }

  async addAddressAndName(id: string, address: string, name: string): Promise<void> {
    const user = this.users.find((user) => user.id === id);

    if (!user) return;

    const idx = this.users.indexOf(user);

    this.users[idx] = {
      ...user,
      address,
      name,
    };
  }
}