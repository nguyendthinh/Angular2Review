import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {

  domain = 'http://localhost:3000';
  authToken;
  user;
  options;

  constructor(
    private http: Http
  ) { }

  // create headers, add token, to be used in HTTP requests for user authentication
  createAuthenticationHeaders(){
    this.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authToken
      })
    })
  }

  // get token from client local storage
  loadToken(){
    this.authToken = localStorage.getItem('token');
  }

  // create/register user accounts
  registerUser(user){
    return this.http.post(this.domain + '/authentication/register', user).map(res => res.json())
  }

  // check if username is taken
  checkUsername(username){
    return this.http.get(this.domain + '/authentication/checkUsername/' + username).map(res => res.json())
  }

  // check if email is taken
  checkEmail(email){
    return this.http.get(this.domain + '/authentication/checkEmail/' + email).map(res => res.json())
  }

  // login user and to begin user session
  login(user){
    return this.http.post(this.domain + '/authentication/login', user).map(res => res.json());
  }

  // logout user and end user session
  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  // store user's data in client local storage
  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  //get user profile
  getProfile(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/authentication/profile', this.options).map(res => res.json());
  }

  //check if user is logged in
  loggedIn(){
    return tokenNotExpired();
  }

  ngOnInit() {
    const token = localStorage.getItem('token'); // Check if a token exists in local storage
    if (token) {
      // Check if the token is not expired
      if (this.loggedIn()) {
        this.loadToken(); // Ensue user is logged in
      } else {
        this.logout(); // Should not have token; log user out
      }
    } else {
      this.logout(); // Log the user out
    }

  }


}
