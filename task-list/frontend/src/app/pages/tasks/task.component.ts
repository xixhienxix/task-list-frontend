import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../_services/task.service';
import { TaskModel } from '../../models/task.model';
import { SpinnerComponent } from "../../_helpers/spinner.component";
import { finalize } from 'rxjs';

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
    SpinnerComponent
],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskPageComponent implements OnInit {
  taskForm: FormGroup;
  tasks: TaskModel[] = [];
  columns = ['titulo', 'descripcion', 'fecha_creacion', 'estado', 'actions'];
  loading:boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private _taskService: TaskService) {
    this.taskForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loading=true;
    this._taskService.tasks$.subscribe((tasks:TaskModel[]) => {
      console.log('Tareas: ', tasks)
      this.tasks = tasks
    });
    this._taskService.getAllTask().pipe(finalize(()=>{
      this.loading=false;
    })).subscribe();
  }

  addTask() {
    this.loading=true;
    if (this.taskForm.valid) {
      const newTask: TaskModel = {
        titulo: this.taskForm.value.titulo,
        descripcion: this.taskForm.value.descripcion,
        fecha_creacion: new Date(),
        estado: false
      };
      this._taskService.agregaTarea(newTask).pipe(finalize(()=>{
        this.loading=false;
      })).subscribe();
      this.taskForm.reset();
    }
  }

  onChangeEstatus(row: TaskModel, updatedEstado: boolean) {
    this.loading=true;
    const updatedTask: TaskModel = {
      ...row,
      estado: updatedEstado
    };

    this._taskService.updateTarea(updatedTask.id!, updatedTask).pipe(finalize(()=>{
      this.loading=false;
    })).subscribe({
      next: () => {
        console.log('Estado actualizado correctamente')
      },
      error: (err) => {
        console.error('Error al actualizar estado', err)
      }
    });
  }

  deleteTask(task: TaskModel) {
    if (!task.id) return; 
    this.loading=true;

    this.loading = true;
    this._taskService.eliminarTarea(task.id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (deletedId) => {
          console.log(`Tarea ${deletedId} eliminada correctamente`);
        },
        error: (err) => {
          console.error('Error al eliminar la tarea:', err);
        }
      });
  }

  cerrarSession() {
    localStorage.removeItem('email');
    this.router.navigate(['/login']);
  }
}
