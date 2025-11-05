import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed, inject, model } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../../models/user.model';
import { ConfirmationDialog } from '../../components/confirmation-modal/confirmation-modal';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit {
  protected users = signal<User[]>([]);
  protected headers = signal<string[]>([]);
  protected isLoading = signal<boolean>(true);
  protected currentPage = signal<number>(0);
  protected itemsPerPage = signal<number>(10);
  public searchTerm = model<string>('');
  protected editingRow = signal<User | null>(null);
  protected editingField = signal<string | null>(null);
  protected displayedColumns = signal<string[]>(['name', 'language', 'id', 'bio', 'version', 'actions']);

  protected filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.users();
    return this.users().filter((user) => user.name.toLowerCase().includes(term));
  });

  protected totalItems = computed(() => this.filteredUsers().length);
  protected displayedUsers = computed(() => {
    const start = this.currentPage() * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredUsers().slice(start, end);
  });

  private router = inject(Router);
  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  public ngOnInit(): void {
    this.loadData();
  }

  public loadData(): void {
    this.isLoading.set(true);
    const cachedUsers = this.userService.getCachedUsers();

    if (cachedUsers && cachedUsers.length > 0) {
      this.setUserData(cachedUsers);
      this.isLoading.set(false);
    } else {
      this.userService.getUsers().subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.setUserData(data);
          }
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading data:', error);
          this.isLoading.set(false);
        },
      });
    }
  }

  private setUserData(data: User[]): void {
    this.headers.set(['name', 'language', 'id', 'bio', 'version']);
    this.users.set(data);
  }

  public openConfirmationModal(user: User): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '400px',
      data: {
        title: 'Delete User',
        message: 'Are you sure you want to delete this user?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUser(user);
        this.snackBar.open('User deleted successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  public deleteUser(userToDelete: User): void {
    this.userService.deleteUser(userToDelete.id);
    const updatedUsers = this.userService.getCachedUsers();
    this.users.set(updatedUsers);
  }

  public setEditing(row: User, field: string): void {
  this.editingRow.set(row);
  this.editingField.set(field);
  }

  public updateUser(row: User, field: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const updatedUser = { ...row, [field]: value };
    this.userService.updateUser(updatedUser);
    const updatedUsers = this.userService.getCachedUsers();
    this.users.set(updatedUsers);
    this.clearEditing();
  }

  public clearEditing(): void {
  this.editingRow.set(null);
  this.editingField.set(null);
  }

  public goToDetails(user: User): void {
    const key = user.id;
  this.router.navigate(['/user', key]);
  }

  public onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.itemsPerPage.set(event.pageSize);
  }

  public onSearchChange(): void {
    this.currentPage.set(0);
  }
}
