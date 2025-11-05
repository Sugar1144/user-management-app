import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public apiUrl = 'https://microsoftedge.github.io/Demos/json-dummy-data/64KB.json';
  public http = inject(HttpClient);
  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}
