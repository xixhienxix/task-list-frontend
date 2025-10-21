export interface TaskModel {
    id?: string;
    titulo:string,
    descripcion:string,
    fecha_creacion:Date,
    estado:boolean
}

export const DEFAULT_TASK_LIST = {
    titulo:'Titulo',
    descripcion:'Descripción',
    fecha_creacion:new Date(),
    estado:false
}