import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.scss',
})
export class ConfirmationDialog {
  public dialogRef = inject(MatDialogRef<ConfirmationDialog>);
  public constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  public onNoClick(): void {
    this.dialogRef.close(false);
  }
  public onYesClick(): void {
    this.dialogRef.close(true);
  }
}
