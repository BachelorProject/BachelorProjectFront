import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {ConfigService} from '../../../config/config.service';

export interface DialogData {
  imageUrl: string;
  id: number;
  type: string;
}

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.css']
})
export class ImageUploaderComponent {

  isUploading = false;
  progress = 0;

  imagePreview: File = undefined;
  previewFileSrc: string | ArrayBuffer = undefined;

  showFile(event) {
    console.log(event);
    this.imagePreview = event[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      this.previewFileSrc = e.target.result;
    };

    reader.readAsDataURL(event[0]);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  uploadFile() {
    this.isUploading = true;
    this.progress = 1;
    this.dialogRef.close(this.previewFileSrc); // wesit ertertma qveda eventma unda daabrunos roca morcheba.
    this.configService.uploadMedia(this.data.id, this.data.type, this.imagePreview)
      .subscribe((httpEvent: HttpEvent<any>) => {
        switch (httpEvent.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            this.isUploading = false;
            this.progress = 0;
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round(httpEvent.loaded / httpEvent.total * 100);
            console.log(`Uploaded! ${this.progress}%`);
            break;
          case HttpEventType.Response:
            console.log('Response has been received!');
            this.progress = 0;
        }
      });
  }

  constructor(
    public dialogRef: MatDialogRef<ImageUploaderComponent>,
    private configService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

}
