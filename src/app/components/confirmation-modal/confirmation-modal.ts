import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DialogData } from '../../models/dialog.model';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirmation-modal.html',
})
export class ConfirmationDialog {
  public readonly dialogRef = inject(MatDialogRef<ConfirmationDialog>);
  public readonly data = signal<DialogData>(inject<DialogData>(MAT_DIALOG_DATA));
  
  public onNoClick(): void {
    this.dialogRef.close(false);
  }
  
  public onYesClick(): void {
    this.dialogRef.close(true);
  }
}
