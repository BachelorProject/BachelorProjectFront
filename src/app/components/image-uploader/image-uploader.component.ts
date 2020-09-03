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
    if (event[0].type !== 'image/jpeg' && event[0].type !== 'image/png' && event[0].type !== 'image/gif') {
      return;
    }
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
    if (this.imagePreview === undefined) {
      return;
    }
    this.isUploading = true;
    this.progress = 1;
    this.configService.uploadMedia(this.data.id, this.data.type, this.imagePreview)
      .subscribe((httpEvent: HttpEvent<any>) => {
        switch (httpEvent.type) {
          case HttpEventType.Sent:
            break;
          case HttpEventType.ResponseHeader:
            this.isUploading = false;
            this.progress = 0;
            this.dialogRef.close(this.previewFileSrc);
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round(httpEvent.loaded / httpEvent.total * 100);
            break;
          case HttpEventType.Response:
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
