import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, throwError } from "rxjs";
import { TaskModel } from "../models/task.model";
import { environment } from "../../environments/environment";

/**
 * Service responsible for managing task-related operations.
 *
 * This service handles fetching, adding, updating, and deleting tasks
 * by communicating with the backend API. It also maintains a local
 * reactive cache of tasks using a `BehaviorSubject`.
 *
 * @example
 * ```ts
 * constructor(private taskService: TaskService) {}
 *
 * ngOnInit() {
 *   this.taskService.getAllTask().subscribe(tasks => {
 *     console.log('Loaded tasks:', tasks);
 *   });
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  /** Internal BehaviorSubject that stores the current list of tasks. */
  private taskList$ = new BehaviorSubject<TaskModel[]>([]);

  /**
   * Exposes the current list of tasks as an observable.
   * Components can subscribe to this to receive real-time updates.
   *
   * @example
   * ```ts
   * this.taskService.tasks$.subscribe(tasks => console.log(tasks));
   * ```
   */
  get tasks$() {
    return this.taskList$.asObservable();
  }

  /**
   * Retrieves the current value of the tasks array.
   *
   * @returns An array of `TaskModel` objects.
   */
  get currentTasksValue(): TaskModel[] {
    return this.taskList$.value;
  }

  /**
   * Updates the local cache of tasks with a new list.
   *
   * @param tasks - The updated array of tasks.
   */
  setCurrentTaskValue(tasks: TaskModel[]) {
    this.taskList$.next(tasks);
  }

  /**
   * Fetches all tasks from the backend API.
   *
   * @returns An observable that emits the list of tasks.
   *
   * @remarks
   * - The result is also cached in the local `BehaviorSubject`.
   * - Errors are logged and rethrown.
   */
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

  /**
   * Creates a new task and updates the local cache.
   *
   * @param newTask - The new task to be added.
   * @returns An observable that emits the created task.
   *
   * @example
   * ```ts
   * const task = { title: 'Nueva tarea', completed: false };
   * this.taskService.agregaTarea(task).subscribe();
   * ```
   */
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

  /**
   * Updates an existing task by its ID and merges the result into the local cache.
   *
   * @param taskId - The ID of the task to update.
   * @param updatedFields - The fields to update (partial `TaskModel`).
   * @returns An observable that emits the updated task.
   *
   * @example
   * ```ts
   * this.taskService.updateTarea('123', { completed: true }).subscribe();
   * ```
   */
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

  /**
   * Deletes a task by its ID and removes it from the local cache.
   *
   * @param taskId - The ID of the task to delete.
   * @returns An observable that emits the ID of the deleted task.
   *
   * @example
   * ```ts
   * this.taskService.eliminarTarea('123').subscribe();
   * ```
   */
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

  /**
   * Creates an instance of `TaskService`.
   * @param http Angular's `HttpClient` for making HTTP requests.
   */
  constructor(private http: HttpClient) { }
}
