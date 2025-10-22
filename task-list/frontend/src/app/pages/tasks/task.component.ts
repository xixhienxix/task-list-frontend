/**
 * @fileoverview
 * `TaskPageComponent` — Component to manage tasks in a CRUD interface.
 *
 * Provides a form to create tasks, a table to view tasks, and the ability to
 * edit, delete, or change task status. Integrates with `TaskService` to fetch
 * and update tasks from the backend. Uses Angular Material and reactive forms.
 *
 * @example
 * <app-task-page></app-task-page>
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../_services/task.service';
import { TaskModel } from '../../models/task.model';
import { SpinnerComponent } from "../../_helpers/spinner.component";
import { finalize } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EditTaskDialogComponent } from '../_modals/edit.task.component';
import { SuccessDialogComponent } from '../../_helpers/_modals/notification.modal.component';

/**
 * Component responsible for task management.
 *
 * Features:
 * - Display task list in a table with Material components
 * - Add new tasks via a reactive form
 * - Edit task using a dialog
 * - Update task status with checkbox
 * - Delete task with confirmation
 * - Show notifications on operations
 * - Handles loading state with spinner
 */
@Component({
  selector: 'app-task-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    SpinnerComponent,
    MatCheckboxModule
  ],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskPageComponent implements OnInit {

  /** Reactive form for creating new tasks */
  taskForm: FormGroup;

  /** Current list of tasks displayed in the table */
  tasks: TaskModel[] = [];

  /** Columns for the Material table */
  columns = ['titulo', 'descripcion', 'fecha_creacion', 'estado', 'actions'];

  /** Flag indicating if a backend request is in progress */
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _taskService: TaskService,
    private dialog: MatDialog
  ) {
    this.taskForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }

  /**
   * On component init, subscribe to task list and fetch all tasks.
   */
  ngOnInit(): void {
    this.loading = true;
    this._taskService.tasks$.subscribe((tasks: TaskModel[]) => {
      console.log('Tareas: ', tasks);
      this.tasks = tasks;
    });

    this._taskService.getAllTask()
      .pipe(finalize(() => this.loading = false))
      .subscribe();
  }

  /**
   * Add a new task using TaskService.
   * Resets the form after submission.
   */
  addTask(): void {
    this.loading = true;
    if (this.taskForm.valid) {
      const newTask: TaskModel = {
        titulo: this.taskForm.value.titulo,
        descripcion: this.taskForm.value.descripcion,
        fecha_creacion: new Date(),
        estado: false
      };

      this._taskService.agregaTarea(newTask)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: () => this.onNotification('Tarea generada con éxito'),
          error: () => this.onNotification('Hubo un problema al crear la tarea, intente más tarde')
        });

      this.taskForm.reset();
    }
  }

  /**
   * Change the status of a task.
   *
   * @param row - The task row to update
   * @param updatedEstado - New status
   */
  onChangeEstatus(row: TaskModel, updatedEstado: boolean): void {
    this.loading = true;
    const updatedTask: TaskModel = { ...row, estado: updatedEstado };

    this._taskService.updateTarea(updatedTask.id!, updatedTask)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => this.onNotification('Estado actualizado correctamente'),
        error: () => this.onNotification('Error al actualizar estado')
      });
  }

  /**
   * Open edit dialog to modify task details.
   *
   * @param task - Task to edit
   */
  editarTarea(task: TaskModel): void {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      width: '500px',
      data: task
    });

    dialogRef.afterClosed().subscribe((updatedTask: TaskModel | undefined) => {
      if (updatedTask) {
        this.loading = true;
        this._taskService.updateTarea(updatedTask.id!, updatedTask)
          .pipe(finalize(() => this.loading = false))
          .subscribe({
            next: () => this.onNotification('Tarea actualizada correctamente'),
            error: () => this.onNotification('Error al actualizar tarea')
          });
      }
    });
  }

  /**
   * Delete a task by id.
   *
   * @param task - Task to delete
   */
  borrarTarea(task: TaskModel): void {
    if (!task.id) return;

    this.loading = true;
    this._taskService.eliminarTarea(task.id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => this.onNotification('Tarea eliminada correctamente'),
        error: () => this.onNotification('Error al eliminar la tarea')
      });
  }

  /**
   * Logout the current user and navigate to login page.
   */
  cerrarSession(): void {
    this.onNotification('Sesión cerrada con éxito');
    localStorage.removeItem('email');
    this.router.navigate(['/login']);
  }

  /**
   * Open a notification dialog with a custom message.
   *
   * @param mensaje - Message to display
   */
  onNotification(mensaje: string): void {
    this.dialog.open(SuccessDialogComponent, {
      width: '300px',
      data: { message: mensaje }
    });
  }
}
