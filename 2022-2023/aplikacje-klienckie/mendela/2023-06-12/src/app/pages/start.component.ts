import { ChangeDetectorRef, Component } from '@angular/core';
import * as xml2js from 'xml2js';

type czasopismo = {
  src: string;
  klik: string;
};

@Component({
  template: `
    <main *ngIf="view==='start'">
        <p>
            Wpisz zarobki z poprzedniego roku:
            <input [(ngModel)]="earnings" type="password" (ngModelChange)="check($event)"> EUR
        </p>

        <p *ngIf="earnings.match(regex)">
            I tak widzimy, że Twoje zarobki to: {{earnings | currency:'EUR':'symbol-narrow':'1.0-3' }}
        </p>
    </main>

    <main *ngIf="view==='next'">
        <p>Idealne zarobki by zrobić dalszą część zadania :)</p>

        <div class="images">
            <a routerLink="./czasopisma/{{czasopismo.klik}}" *ngFor="let czasopismo of czasopisma">
                <img src={{czasopismo.src}} alt={{czasopismo.klik}} />
            </a>
        </div>
    </main>
  `,
  styleUrls: ['../app.component.scss'],
})
export class StartComponent {
  private baseImgUrl: string =
    'http://atarionline.pl/biblioteka/czasopisma/img/';
  private prevEarnings = '';

  public view: 'start' | 'next' = 'start';
  public earnings = '';
  public regex = /^\d+(?:\.\d*)?$/;
  public czasopisma: czasopismo[] = [];

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    fetch('./assets/czasopisma.xml')
      .then((res) => res.text())
      .then((data) => {
        const parser = new xml2js.Parser({ explicitArray: false });
        parser.parseString(data, (err, res) => {
          console.log(res);
          this.czasopisma = Object.values(
            res.czasopisma.zmienne as { [key: string]: czasopismo }
          ).map((el) => {
            el.src = this.baseImgUrl + el.src;
            return el;
          });
        });
      })
      .catch(console.error);
  }

  check(value: string) {
    const pattern = /^\d+(?:\.?\d*)?$/g;
    this.changeDetector.detectChanges();

    if (value === '666.666') {
      this.view = 'next';
    } else if (value === '') {
      this.earnings = '';
    } else {
      this.earnings = value.match(pattern)?.at(0) ?? this.prevEarnings;
    }
    this.prevEarnings = this.earnings;
  }
}
