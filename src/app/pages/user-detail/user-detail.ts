import { TitleCasePipe } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    RouterLink, 
    TitleCasePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss',
})
export class UserDetail {
  user = signal<User | undefined>(undefined);

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    const localUsers = localStorage.getItem('users');
    if (localUsers) {
      const users = JSON.parse(localUsers);
      const foundUser = users.find((user: User) => user.id === userId || (user as any).guid === userId);
      if (!foundUser) {
        this.router.navigate(['/']);
      } else {
        this.user.set(foundUser);
      }
    } else {
      this.router.navigate(['/']);
    }
  }
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
