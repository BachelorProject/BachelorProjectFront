import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfigService} from '../../../config/config.service';
import {AuthServiceLocal} from '../../auth.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  state = 'login';
  loginFromGroup: FormGroup;
  registerFormGroup: FormGroup;
  recoverFromGroup: FormGroup;
  newPassFromGroup: FormGroup;
  passwordsMatch = true;
  post: any = '';
  recoverToken = '';

  constructor(private formBuilder: FormBuilder, private configService: ConfigService, private authService: AuthServiceLocal,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.recoverToken = params.recoverToken;
      if (this.recoverToken != null) {
        this.state = 'recover password';
      }
    });
  }

  ngOnInit() {
    this.createForm();
    // this.authService.authState.subscribe((user) => {
    //   this.user = user;
    //   this.loggedIn = (user != null);
    // });
  }


  createForm() {
    const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.loginFromGroup = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(emailRegex)]],
      password: [null, [Validators.required, this.checkPasswordLogin]]
    });
    this.registerFormGroup = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(emailRegex)]],
      password: [null, [Validators.required, this.checkPasswordRegister]],
      repassword: [null, [Validators.compose(
        [Validators.required, this.checkRePasswordRegister.bind(this)]
      )]]
    });
    this.recoverFromGroup = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(emailRegex)]]
    });
    this.newPassFromGroup = this.formBuilder.group({
      password: [null, [Validators.required, this.checkPasswordRegister]],
      repassword: [null, [Validators.compose(
        [Validators.required, this.checkRePasswordRegister.bind(this)]
      )]]
    });
  }

  checkPasswordRegister(control) {
    const enteredPassword = control.value;
    const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? {requirements: true} : null;
  }

  checkRePasswordRegister(fieldControl: FormControl) {
    const firstPassword = this.registerFormGroup !== undefined && this.registerFormGroup.get('password') !== null
      ? this.registerFormGroup.get('password').value : '';
    const secondPassword = fieldControl !== undefined ? fieldControl.value : '';
    this.passwordsMatch = firstPassword !== secondPassword;
    return this.passwordsMatch ? {missmatch: true} : null;
  }

  checkPasswordLogin(control) {
    const enteredPassword = control.value;
    const passwordCheck = /(?=.{8,})/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? {requirements: true} : null;
  }

  getErrorEmailRegister() {
    return this.registerFormGroup.get('email').hasError('required') ? 'Field is required' :
      this.registerFormGroup.get('email').hasError('pattern') ? 'Not a valid email' :
        this.registerFormGroup.get('email').hasError('alreadyInUse') ? 'This email is already in use' : '';
  }

  getErrorEmailRecover() {
    return this.recoverFromGroup.get('email').hasError('required') ? 'Field is required' :
      this.recoverFromGroup.get('email').hasError('pattern') ? 'Not a valid email' : '';
  }

  getErrorPassword() {
    return this.registerFormGroup.get('password').hasError('required') ? 'Field is required (At least 8 characters, one uppercase letter and one number)' :
      this.registerFormGroup.get('password').hasError('requirements') ? 'Password requirements are not met. (At least eight characters, one uppercase letter and one number.)' : '';
  }

  getErrorRePassword() {
    return this.registerFormGroup.get('repassword').hasError('required') ? 'Field is required' : 'Passwords does not match.';
  }

  getErrorEmailLogin() {
    return this.loginFromGroup.get('email').hasError('required') ? 'Field is required' :
      this.loginFromGroup.get('email').hasError('pattern') ? 'Not a valid email address' : '';
  }

  getErrorPasswordLogin() {
    return this.loginFromGroup.get('password').hasError('required') ? 'Field is required' : '';
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle();
  }

  signInWithFB() {
    this.authService.signInWithFB();
  }

  onSubmitLogin(post) {
    if (post.email !== null && post.password !== null) {
      this.authService.signIn(post.email, post.password);
    }
  }

  onSubmitRegister(post) {
    if (post.email !== null && post.password !== null) {
      this.authService.signUp(post.email, post.password);
    }
  }

  onSubmitRecover(post) {
    if (post.email !== null) {
      // Todo: mariam daamate es servisi.
      // this.authService.recoverPassword(post.email);
    }
  }

  changeState(state) {
    this.state = state;
  }

}
