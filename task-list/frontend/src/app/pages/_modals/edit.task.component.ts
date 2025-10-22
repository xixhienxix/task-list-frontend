/**
 * @fileoverview
 * `EditTaskDialogComponent` — Modal dialog component for editing existing tasks.
 * 
 * This component uses Angular Material’s dialog system to allow users to modify
 * a `TaskModel` (title, description, and completion status). It is a **standalone component**
 * and includes all necessary Material modules for form handling and UI.
 *
 * The component validates user input before submitting and automatically updates
 * the task creation date upon saving.
 */

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { TaskModel } from '../../models/task.model';

/**
 * Dialog component that provides a form for editing an existing task.
 *
 * @example
 * ```ts
 * this.dialog.open(EditTaskDialogComponent, {
 *   data: currentTask
 * }).afterClosed().subscribe((updatedTask) => {
 *   if (updatedTask) this.taskService.updateTarea(updatedTask.id!, updatedTask);
 * });
 * ```
 */
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
  styleUrls: ['./edit.task.component.scss']
})
export class EditTaskDialogComponent {
  /**
   * Reactive form used for editing the task fields.
   */
  editForm: FormGroup;

  /**
   * Creates an instance of the EditTaskDialogComponent.
   *
   * @param fb - Angular FormBuilder for constructing the reactive form.
   * @param dialogRef - Reference to the open dialog, used to close it with or without data.
   * @param task - Injected task data that is being edited.
   */
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public task: TaskModel
  ) {
    // Initialize the form with the task's current values
    this.editForm = this.fb.group({
      titulo: [task.titulo, Validators.required],
      descripcion: [task.descripcion, Validators.required],
      estado: [task.estado]
    });
  }

  /**
   * Saves the edited task if the form is valid.
   *
   * Merges the form values into the existing `TaskModel`
   * and automatically updates the `fecha_creacion` to the current date.
   * Closes the dialog and returns the updated task.
   *
   * @returns void
   */
  save(): void {
    if (this.editForm.valid) {
      const updatedTask: TaskModel = {
        ...this.task,
        ...this.editForm.value,
        fecha_creacion: new Date() // update date automatically
      };
      this.dialogRef.close(updatedTask);
    }
  }

  /**
   * Cancels the dialog without saving any changes.
   *
   * Closes the modal and returns no data.
   *
   * @returns void
   */
  cancel(): void {
    this.dialogRef.close();
  }
}
