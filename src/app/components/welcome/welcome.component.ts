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
  recoverEmail = '';

  constructor(private formBuilder: FormBuilder, private configService: ConfigService, private authService: AuthServiceLocal,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.recoverToken = params.recoverToken;
      if (this.recoverToken != null) {
        this.state = 'recover password';
      }
      this.recoverEmail = params.recoverEmail;
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
        [Validators.required, this.checkRePasswordRecover.bind(this)]
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

  checkRePasswordRecover(fieldControl: FormControl) {
    const firstPassword = this.newPassFromGroup !== undefined && this.newPassFromGroup.get('password') !== null
      ? this.newPassFromGroup.get('password').value : '';
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

  getErrorPasswordRegister() {
    return this.registerFormGroup.get('password').hasError('required') ? 'Field is required (At least 8 characters, one uppercase letter and one number)' :
      this.registerFormGroup.get('password').hasError('requirements') ? 'Password requirements are not met. (At least eight characters, one uppercase letter and one number.)' : '';
  }

  getErrorRePasswordRegister() {
    return this.registerFormGroup.get('repassword').hasError('required') ? 'Field is required' : 'Passwords does not match.';
  }
  getErrorPasswordNewPass() {
    return this.newPassFromGroup.get('password').hasError('required') ? 'Field is required (At least 8 characters, one uppercase letter and one number)' :
      this.newPassFromGroup.get('password').hasError('requirements') ? 'Password requirements are not met. (At least eight characters, one uppercase letter and one number.)' : '';
  }

  getErrorRePasswordNewPass() {
    console.log(this.newPassFromGroup.get('repassword').errors);
    return this.newPassFromGroup.get('repassword').hasError('required') ? 'Field is required' : 'Passwords does not match.';
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

  onSubmitChangePassword(post) {
    // add token
    if (this.recoverEmail !== null && post.password !== null) {
      this.authService.changePassword(this.recoverEmail, post.password, this.recoverToken);
    }
  }

  onSubmitRecover(post) {
    if (post.email !== null) {
      // Todo: mariam daamate es servisi.
      this.authService.recoverPassword(post.email);
    }
  }

  changeState(state) {
    this.state = state;
  }

}
