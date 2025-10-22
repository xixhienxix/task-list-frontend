import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './notification.modal.component.html',
  styleUrls: ['./notification.modal.component.scss'],
})
export class SuccessDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) { }

  /**
 * Closes the currently open dialog.
 *
 * This method invokes `MatDialogRef.close()` to close the modal
 * and optionally return data to the parent component.
 *
 * @example
 * // Inside a dialog component:
 * this.close();
 *
 * @see https://material.angular.io/components/dialog/overview
 */
  close() {
    this.dialogRef.close();
  }
}
