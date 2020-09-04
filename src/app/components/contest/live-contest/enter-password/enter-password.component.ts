import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfigService} from '../../../../../config/config.service';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-enter-password',
  templateUrl: './enter-password.component.html',
  styleUrls: ['./enter-password.component.css']
})
export class EnterPasswordComponent implements OnInit, AfterViewInit {

  newPassFromGroup: FormGroup;
  @ViewChild('oldPassword') oldPassword: ElementRef;

  ngOnInit(): void {
    this.newPassFromGroup = this.formBuilder.group({
      password: [null, [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    this.newPassFromGroup.patchValue({
      password: ''
    });
  }

  onSubmitChangePassword(post) {
    if (post.password !== null) {
      this.dialogRef.close(post.password);
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private configService: ConfigService,
    public dialogRef: MatDialogRef<EnterPasswordComponent>) {
  }

}
