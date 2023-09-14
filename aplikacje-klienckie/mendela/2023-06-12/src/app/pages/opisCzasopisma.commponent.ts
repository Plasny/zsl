import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { xmlData } from '../xmlData.service';

@Component({
  selector: 'app-root',
  templateUrl: './opisCzasopisma.component.html',
  styleUrls: ['../app.component.scss'],
})
export class OpisCzasopismaComponent {
  title: string = '';
  view: 'ok' | 'err' = 'ok';
  selectedYear: string = '';
  years: string[] = [];
  czasopisma: any = [];

  constructor(
    private route: ActivatedRoute,
    private xmlData: xmlData,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const name = params.get('name');
      const year = params.get('year');
      if (
        name &&
        year &&
        this.xmlData.getTitles().includes(name) &&
        (this.xmlData.getYears(name).includes(year) || year === 'Wszystkie')
      ) {
        this.view = 'ok';
        this.title = `Czasopismo ${name} - ${year}`;
        this.years = this.xmlData.getYears(name);
        this.selectedYear = year;

        if (year !== 'Wszystkie') {
          this.czasopisma = this.xmlData.getMagazines(name, year);
        } else {
          this.czasopisma = this.xmlData.getMagazines(name);
        }
      } else {
        this.view = 'err';
        setTimeout(() => {
          this.router.navigate(['czasopisma']);
        }, 5000);
      }
    });
  }
}
