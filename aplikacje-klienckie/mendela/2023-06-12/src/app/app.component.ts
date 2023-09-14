import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public date = Date.now();

  ngOnInit() {
    setInterval(() => {
      this.date = Date.now();
    }, 1000);
  }
}
