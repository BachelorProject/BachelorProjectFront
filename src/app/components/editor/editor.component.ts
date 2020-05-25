import {AfterViewInit, Component, Input, Output} from '@angular/core';
import * as Editor from './ckeditor';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit {

  public Editor = Editor;
  @Input() initialData = '';
  @Input() isEditable = true;
  @Input() placeholder = '';
  @Input() toolbar = [
    'heading', '|', 'bold', 'italic', 'fontBackgroundColor', 'fontColor', 'fontSize', 'fontFamily', 'link', 'bulletedList', 'numberedList', '|', 'strikethrough', 'horizontalLine', 'highLight', 'mathType', 'chemType', 'subscript', 'superscript', 'underline', '|', 'indent', 'outdent', 'alignment', '|', 'imageUpload', 'mediaEmbed', 'blockQuote', 'insertTable', 'code', 'codeBlock', 'specialCharacters', 'undo', 'redo'
  ];
  @Output() data: string;

  ngAfterViewInit(): void {
  }

  onChange(event) {
    if (event.editor !== undefined && event.editor.getData() !== undefined) {
      this.data = event.editor.getData();
    }
  }

}
