import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed, inject } from '@angular/core';
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
  users = signal<User[]>([]);
  headers = signal<string[]>([]);
  isLoading = signal<boolean>(true);
  currentPage = signal<number>(0);
  itemsPerPage = signal<number>(10);
  searchTerm = signal<string>('');
  editingRow = signal<User | null>(null);
  editingField = signal<string | null>(null);
  displayedColumns = signal<string[]>([]);

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.users();
    return this.users().filter((user) => user.name.toLowerCase().includes(term));
  });

  totalItems = computed(() => this.filteredUsers().length);
  displayedUsers = computed(() => {
    const start = this.currentPage() * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredUsers().slice(start, end);
  });

  private router = inject(Router);
  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    const localUsers = localStorage.getItem('users');

    if (localUsers) {
      const data = JSON.parse(localUsers);
      this.setUserData(data);
      this.isLoading.set(false);
    } else {
      this.userService.getUsers().subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.users.set(data);
            localStorage.setItem('users', JSON.stringify(data));
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
    const excludedFields = ['tags', 'friends'];
    const headers = Object.keys(data[0]).filter(
      (key) => !excludedFields.includes(key) && typeof data[0][key] !== 'object'
    );
  this.headers.set(headers);
  this.displayedColumns.set([...headers, 'actions']);
  this.users.set(data);
  }

  openConfirmationModal(user: User): void {
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

  deleteUser(userToDelete: User): void {
    const updatedUsers = this.users().filter((user) => user.id !== userToDelete.id);
    this.users.set(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  }

  setEditing(row: User, field: string): void {
  this.editingRow.set(row);
  this.editingField.set(field);
  }

  updateUser(row: User, field: string, event: any): void {
    const value = event.target.value;
    const updatedUsers = this.users().map((user) =>
      user.id === row.id ? { ...user, [field]: value } : user
    );
    this.users.set(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  this.clearEditing();
  }

  clearEditing(): void {
  this.editingRow.set(null);
  this.editingField.set(null);
  }

  goToDetails(user: User): void {
    const key = (user as any).id ?? (user as any).guid;
  this.router.navigate(['/user', key]);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.itemsPerPage.set(event.pageSize);
  }

  onSearchChange(): void {
    this.currentPage.set(0);
  }
}
