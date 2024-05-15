import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-spinner-dialog-content',
  templateUrl: './spinner-dialog-content.component.html',
  styleUrl: './spinner-dialog-content.component.scss'
})
export class SpinnerDialogContentComponent {
  @Output() dialogClosed = new EventEmitter<boolean>();

  constructor() {}

  onClose(): void {
    this.dialogClosed.emit(true); // Emit true when dialog is closed manually
  }
}
