// edit-task-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { TaskModel } from '../../models/task.model';

@Component({
  selector: 'app-edit-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './edit.task.component.html',
  styleUrls:['./edit.task.component.scss']
})
export class EditTaskDialogComponent {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public task: TaskModel
  ) {
    this.editForm = this.fb.group({
      titulo: [task.titulo, Validators.required],
      descripcion: [task.descripcion, Validators.required],
      estado: [task.estado]
    });
  }

  save() {
    if (this.editForm.valid) {
      const updatedTask: TaskModel = {
        ...this.task,
        ...this.editForm.value,
        fecha_creacion: new Date() // update date automatically
      };
      this.dialogRef.close(updatedTask);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
