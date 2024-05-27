import { Component, NgZone, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details-dialog',
  templateUrl: './details-dialog.component.html',
  styleUrls: ['./details-dialog.component.scss']
})
export class DetailsDialogComponent implements OnInit {
  currentTime!: string;

  constructor(public dialogRef: MatDialogRef<DetailsDialogComponent>, private router: Router, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.getCurrentTime();
  }

  getCurrentTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
  }

  startTask() {
    // Close the dialog
    this.ngZone.run(() => {
      this.dialogRef.close(0);
      this.router.navigate(['/orders'])
      this.dialogRef.close();
    });
   
    
  }
}
