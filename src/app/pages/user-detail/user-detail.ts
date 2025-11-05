import { TitleCasePipe } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

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
  protected user = signal<User | undefined>(undefined);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);

  public ngOnInit(): void {
    this.setUserDetail();
  }

  private setUserDetail(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    const users = this.userService.getCachedUsers();
    if (users && users.length > 0) {
      const foundUser = users.find((u) => u.id === userId);
      if (!foundUser) {
        this.router.navigate(['/']);
      } else {
        this.user.set(foundUser);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  public objectKeys(obj: Record<string, number | string>): string[] {
    return Object.keys(obj);
  }
}
