import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://microsoftedge.github.io/Demos/json-dummy-data/64KB.json';
  private http = inject(HttpClient);
  
  private usersCache = signal<User[]>([]);

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      tap(users => this.usersCache.set(users))
    );
  }

  public getCachedUsers(): User[] {
    return this.usersCache();
  }

  public updateUser(updatedUser: User): void {
    const users = this.usersCache();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      const updatedUsers = [...users];
      updatedUsers[index] = updatedUser;
      this.usersCache.set(updatedUsers);
    }
  }

  public deleteUser(userId: string): void {
    const users = this.usersCache();
    const updatedUsers = users.filter(u => u.id !== userId);
    this.usersCache.set(updatedUsers);
  }

  public setUsers(users: User[]): void {
    this.usersCache.set(users);
  }
}
