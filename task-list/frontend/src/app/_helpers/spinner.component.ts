import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector:'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrl: './spinner.component.scss',    
    standalone:true,
    imports:[CommonModule],
})
export class SpinnerComponent {
    @Input() size:number=30;
    @Input() color: string = '#3498db'; 
    @Input() loading:boolean = false;
    @Input() loginValidate:boolean=false;
}