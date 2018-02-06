import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  messageClass;
  message;
  newPost = false;
  loadingBlogs = false;
  form;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.createNewBlogForm()
  }

  createNewBlogForm(){
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5)
      ])]
    })
  }

  alphaNumericValidation(controls){
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    if (regExp.test(controls.value)) {
      return null
    } else {
      return { 'alphaNumericValidation': true}
    }
  }

  newBlogForm(){
    this.newPost = true;
  }

  reloadBlog(){
    this.loadingBlogs = true;
    setTimeout(() => {
      this.loadingBlogs = false;
    }, 4000)
  }

  draftComment(){

  }

  ngOnInit() {
  }

}
