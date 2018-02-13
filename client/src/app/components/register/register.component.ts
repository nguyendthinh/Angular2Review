import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  message;
  messageClass;
  processing = false;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm() //create Angular 2 Reactive Form when component loads
  }

  createForm() {
    this.form = this.formBuilder.group({
      //composed reactive field inputs, insert validations into inputs including custom validator functions
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.validateUsername
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35),
        this.validatePassword
      ])],
      confirm: ['', Validators.required]
    }, { validator: this.matchingPasswords('password', 'confirm')}) //custom validator for form: to compare inputs for password and confirm fields
  }

  disableForm(){
    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();
  }

  enableForm(){
    this.form.controls['email'].enable();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
  }

  validateEmail(controls){
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regExp.test(controls.value)) {
      return null; // Return as valid email
    } else {
      return { 'validateEmail': true } // Return as invalid email
    }
  }

  validateUsername(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    // Test username against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid username
    } else {
      return { 'validateUsername': true } // Return as invalid username
    }
  }

  validatePassword(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    // Test password against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid password
    } else {
      return { 'validatePassword': true } // Return as invalid password
    }
  }

  // ensure passwords match
  matchingPasswords(password, confirm){
    return (group: FormGroup) => {
      if (group.controls[password].value === group.controls[confirm].value){
        return null;
      } else {
        return {'matchingPasswords': true}
      }
    }
  }

  //submit registration form
  onRegisterSubmit(){
    this.processing = true; //notify HTML that form is currently processing and disable submit button
    this.disableForm() //disable form
    const user = {
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value
    }

    /// Register user through authService method
    this.authService.registerUser(user).subscribe(data => {
      if (!data.success){
        this.messageClass = 'alert alert-danger'; //set pop-up message color
        this.message = data.message; //set pop-up message text
        this.processing = false; //renable submit button
        this.enableForm()
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this.router.navigate(['/login']); // Redirect to login view
        }, 1500);
      }
    })
  }

  //Check to see if email is taken
  checkEmail(){
    this.authService.checkEmail(this.form.get('email').value).subscribe(data => {
      if (!data.success){
        this.emailValid = false;
        this.emailMessage = data.message;
      }
      else {
        this.emailValid = true;
        this.emailMessage = data.message;
      }
    })
  }

  //Check to see if username is taken

  checkUsername(){
    this.authService.checkUsername(this.form.get('username').value).subscribe(data => {
      if (!data.success){
        this.usernameValid = false;
        this.usernameMessage = data.message;
      }
      else {
        this.usernameValid = true;
        this.usernameMessage = data.message;
      }
    })
  }

  ngOnInit() {
  }

}
