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
  taskForm: FormGroup;
  tasks: TaskModel[] = [];
  columns = ['titulo', 'descripcion', 'fecha_creacion', 'estado', 'actions'];
  loading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private router: 
    Router, private _taskService: TaskService, 
    private dialog: MatDialog,
  ) {
    this.taskForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this._taskService.tasks$.subscribe((tasks: TaskModel[]) => {
      console.log('Tareas: ', tasks)
      this.tasks = tasks
    });
    this._taskService.getAllTask().pipe(finalize(() => {
      this.loading = false;
    })).subscribe();
  }

  addTask() {
    this.loading = true;
    if (this.taskForm.valid) {
      const newTask: TaskModel = {
        titulo: this.taskForm.value.titulo,
        descripcion: this.taskForm.value.descripcion,
        fecha_creacion: new Date(),
        estado: false
      };
      this._taskService.agregaTarea(newTask).pipe(finalize(() => {
        this.loading = false;
      })).subscribe({
        next:()=>{
          this.onNotification('Tarea Generada con exitó')
        },
        error:()=>{
          this.onNotification('Hubó un problema al crear la tarea intente de nuevo mas tarde')
        }
      });
      this.taskForm.reset();
    }
  }

  onChangeEstatus(row: TaskModel, updatedEstado: boolean) {
    this.loading = true;
    const updatedTask: TaskModel = {
      ...row,
      estado: updatedEstado
    };

    this._taskService.updateTarea(updatedTask.id!, updatedTask).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: () => {
        this.onNotification('Estado actualizado correctamente')
      },
      error: (err) => {
        this.onNotification('Error al actualizar estado')
      }
    });
  }


  editarTarea(task: TaskModel) {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      width: '500px',
      data: task
    });

    dialogRef.afterClosed().subscribe((updatedTask: TaskModel | undefined) => {
      if (updatedTask) {
        this.loading = true;
        this._taskService.updateTarea(updatedTask.id!, updatedTask)
          .pipe(finalize(() => (this.loading = false)))
          .subscribe({
            next: () => {
              this.onNotification('Tarea actualizada correctamente')
            },
            error: (err) => {
              this.onNotification('Error al actualizar tarea')
            }
          });
      }
    });
  }


  borrarTarea(task: TaskModel) {
    if (!task.id) return;
    this.loading = true;

    this.loading = true;
    this._taskService.eliminarTarea(task.id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (deletedId) => {
          this.onNotification(`Tarea eliminada correctamente`)
        },
        error: (err) => {
          this.onNotification(`'Error al eliminar la tarea`)
        }
      });
  }

  cerrarSession() {
    this.onNotification(`Sesión cerrada con exito`)
    localStorage.removeItem('email');
    this.router.navigate(['/login']);
  }

  onNotification(mensaje:string) {
    this.dialog.open(SuccessDialogComponent, {
      width: '300px',
      data: { message: mensaje },
    });
  }

}
