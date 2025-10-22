/**
 * Represents a single task item within the task management system.
 *
 * This model defines the structure used across the frontend and backend
 * for creating, retrieving, updating, and deleting tasks.
 *
 * @example
 * ```ts
 * const newTask: TaskModel = {
 *   titulo: 'Estudiar Angular',
 *   descripcion: 'Revisar componentes, servicios y directivas',
 *   fecha_creacion: new Date(),
 *   estado: false
 * };
 * ```
 */
export interface TaskModel {
  /**
   * Optional unique identifier assigned to each task.
   * Usually generated automatically by the backend or database.
   *
   * @example "b81d3a7f-9230-4a9a-a75b-1f431e8f92ab"
   */
  id?: string;

  /**
   * Short descriptive title summarizing the task.
   *
   * @example "Actualizar documentación del proyecto"
   */
  titulo: string;

  /**
   * Detailed explanation of the task to be performed.
   *
   * @example "Agregar TSDoc a todos los servicios y componentes principales"
   */
  descripcion: string;

  /**
   * Timestamp indicating when the task was created.
   * Automatically assigned upon creation.
   *
   * @example new Date('2025-10-21T14:30:00Z')
   */
  fecha_creacion: Date;

  /**
   * Boolean flag representing the task’s completion state.
   * - `true` → task completed
   * - `false` → task pending
   *
   * @example false
   */
  estado: boolean;
}

/**
 * Default template used to initialize new tasks or mock data.
 * Provides base values to prevent undefined property errors.
 *
 * @example
 * ```ts
 * const defaultTask = { ...DEFAULT_TASK_LIST };
 * ```
 */
export const DEFAULT_TASK_LIST: TaskModel = {
  titulo: 'Título',
  descripcion: 'Descripción',
  fecha_creacion: new Date(),
  estado: false
};
