import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';


@Injectable()
export class BlogService {

  options;
  domain = this.authService.domain;

  constructor(
    private authService: AuthService,
    private http: Http
  ) { }

  // create headers, add token, to be used in HTTP requests for user authentication
  createAuthenticationHeaders(){
    // get token so it can be attached to headers
    this.authService.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // format set to JSON
        'authorization': this.authService.authToken // attach token
      })
    })
  }

  // create a new blog post
  newBlog(blog){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + '/blogs/newBlog', blog, this.options).map(res => res.json())
  }

  // get all blogs from the database
  getAllBlogs(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/blogs/allBlogs', this.options).map(res => res.json());
  }

  // get one blog using its id
  getSingleBlog(id) {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/blogs/singleBlog/' + id, this.options).map(res => res.json());
  }

  // edit/update blog post
  editBlog(blog) {
    this.createAuthenticationHeaders();
    return this.http.put(this.domain + '/blogs/updateBlog/', blog, this.options).map(res => res.json());
  }

  deleteBlog(id) {
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + '/blogs/deleteBlog/' + id, this.options).map(res => res.json());
  }

  likeBlog(id) {
    const blogData = { id: id}
    return this.http.put(this.domain + '/blogs/likeBlog/', blogData, this.options).map(res => res.json());
  }

  dislikeBlog(id) {
    const blogData = { id: id}
    return this.http.put(this.domain + '/blogs/dislikeBlog/', blogData, this.options).map(res => res.json());
  }

}
