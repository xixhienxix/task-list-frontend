import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, throwError } from "rxjs";
import { TaskModel } from "../models/task.model";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private taskList$ = new BehaviorSubject<TaskModel[]>([]);

  constructor(private http: HttpClient) {}

  get tasks$() {
    return this.taskList$.asObservable();
  }

  get currentTasksValue(): TaskModel[] {
    return this.taskList$.value;
  }

  setCurrentTaskValue(tasks: TaskModel[]) {
    this.taskList$.next(tasks);
  }

  getAllTask() {
    const url = `${environment.backendURL}/tasks`;
    return this.http.get<{ success: boolean; tasks: TaskModel[] }>(url).pipe(
      map((res) => {
        const tasks = res.tasks || [];
        this.taskList$.next(tasks);
        return tasks;
      }),
      catchError((error) => {
        console.error("Error al recuperar la lista de tareas:", error);
        return throwError(() => error);
      })
    );
  }

  agregaTarea(newTask: TaskModel) {
    const url = `${environment.backendURL}/tasks`;
    return this.http.post<TaskModel>(url, newTask).pipe(
      map((task) => {
        const updatedTasks = [task, ...this.currentTasksValue];
        this.taskList$.next(updatedTasks);
        return task;
      }),
      catchError((error) => {
        console.error("Error al agregar la tarea:", error);
        return throwError(() => error);
      })
    );
  }

  updateTarea(taskId: string, updatedFields: Partial<TaskModel>) {
    const url = `${environment.backendURL}/tasks/${taskId}`;
    return this.http.put<TaskModel>(url, updatedFields).pipe(
      map((updatedTask) => {
        const updatedTasks = this.currentTasksValue.map((task) =>
          task.id === taskId ? { ...task, ...updatedTask } : task
        );
        this.taskList$.next(updatedTasks);
        return updatedTask;
      }),
      catchError((error) => {
        console.error("Error al actualizar la tarea:", error);
        return throwError(() => error);
      })
    );
  }

  /** 🔹 DELETE: Remove a task */
  eliminarTarea(taskId: string) {
    const url = `${environment.backendURL}/tasks/${taskId}`;
    return this.http.delete<{ success: boolean; id: string }>(url).pipe(
      map(() => {
        const filteredTasks = this.currentTasksValue.filter(
          (task) => task.id !== taskId
        );
        this.taskList$.next(filteredTasks);
        return taskId;
      }),
      catchError((error) => {
        console.error("Error al eliminar la tarea:", error);
        return throwError(() => error);
      })
    );
  }
}
