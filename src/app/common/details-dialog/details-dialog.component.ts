import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details-dialog',
  templateUrl: './details-dialog.component.html',
  styleUrls: ['./details-dialog.component.scss']
})
export class DetailsDialogComponent implements OnInit {
  currentTime!: string;

  constructor(public dialogRef: MatDialogRef<DetailsDialogComponent>, private router: Router) { }

  ngOnInit(): void {
    this.getCurrentTime();
  }

  getCurrentTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
  }

  startTask() {
    // Perform actions when the button is clicked
    console.log('Match successful, start ranking the task');
    // Close the dialog
    this.router.navigate(['/orders'])
    this.dialogRef.close();
  }
}
