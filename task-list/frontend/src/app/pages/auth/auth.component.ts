import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth.component',
  standalone: true,
  imports:[
    CommonModule,
    ReactiveFormsModule, 
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule 
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

  email:string=''
  password:string=''

  onSubmit(){
        console.log('Email:', this.email);
  }
}
