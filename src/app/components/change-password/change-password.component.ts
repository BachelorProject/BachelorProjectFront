import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {ConfigService} from '../../../config/config.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit, AfterViewInit {

  newPassFromGroup: FormGroup;
  passwordsMatch = true;
  @ViewChild('oldPassword') oldPassword: ElementRef;

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.newPassFromGroup = this.formBuilder.group({
      password: [null, [Validators.required]],
      newPassword: [null, [Validators.required, this.checkPasswordRegister]],
      reNewPassword: [null, [Validators.compose(
        [Validators.required, this.checkRePasswordRecover.bind(this)]
      )]]
    });
  }

  ngAfterViewInit(): void {
    this.newPassFromGroup.patchValue({
      password: '',
      newPassword: '',
      reNewPassword: ''
    });
  }

  checkPasswordRegister(control) {
    const enteredPassword = control.value;
    const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? {requirements: true} : null;
  }

  getErrorPassword() {
    return this.newPassFromGroup.get('newPassword').hasError('required') ? 'Field is required.' : '';
  }

  getErrorPasswordNewPass() {
    return this.newPassFromGroup.get('newPassword').hasError('required') ? 'Field is required (At least 8 characters, one uppercase letter and one number)' :
      this.newPassFromGroup.get('newPassword').hasError('requirements') ? 'Password requirements: At least 8 characters, 1 uppercase letter and 1 number.' : '';
  }

  getErrorRePasswordNewPass() {
    return this.newPassFromGroup.get('reNewPassword').hasError('required') ? 'Field is required' : 'Passwords does not match.';
  }

  onSubmitChangePassword(post) {
    if (post.password !== null && post.newPassword !== null) {
      this.configService.updatePassword(post.password, post.newPassword)
        .subscribe(
          value => {
            if (value === undefined || value === '') {
              this.dialogRef.close();
            } else {
              this.oldPassword.nativeElement.focus();
              this.oldPassword.nativeElement.select();
            }
          }, error => {
          }
        );
    }
  }

  checkRePasswordRecover(fieldControl: FormControl) {
    const firstPassword = this.newPassFromGroup !== undefined && this.newPassFromGroup.get('newPassword') !== null
      ? this.newPassFromGroup.get('newPassword').value : '';
    const secondPassword = fieldControl !== undefined ? fieldControl.value : '';
    this.passwordsMatch = firstPassword !== secondPassword;
    return this.passwordsMatch ? {missmatch: true} : null;
  }

  constructor(
    private formBuilder: FormBuilder,
    private configService: ConfigService,
    public dialogRef: MatDialogRef<ChangePasswordComponent>) {
  }

}
