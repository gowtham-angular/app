import { Component } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent {
  currentIndex = 0;
  slides = [
    { id: 1, image: 'https://picsum.photos/900/500?random&t=6', title: 'Slide 1', description: 'Description for Slide 1' },
    { id: 2, image: 'https://picsum.photos/900/500?random&t=7', title: 'Slide 2', description: 'Description for Slide 2' },
    { id: 3, image: 'https://picsum.photos/900/500?random&t=8', title: 'Slide 3', description: 'Description for Slide 3' },
    // Add more slides as needed
  ];

  nextSlide() {
    if (this.currentIndex < this.slides.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.slides.length - 1;
    }
  }
}
