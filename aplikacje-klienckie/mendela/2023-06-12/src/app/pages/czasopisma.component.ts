import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { xmlData } from '../xmlData.service';

@Component({
  selector: 'app-root',
  templateUrl: './czasopisma.component.html',
  styleUrls: ['../app.component.scss'],
})
export class CzasopismaComponent {
  title: string = '';
  years: string[] = [];
  view: 'magazineList' | 'magazinesYears' | 'err' = 'magazineList';
  imgList: { src: string; klik: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private xmlData: xmlData,
    private router: Router
  ) {}

  ngOnInit() {
    this.imgList = this.xmlData.getImgList();

    this.route.paramMap.subscribe((params: ParamMap) => {
      const name = params.get('name');
      if (name && this.xmlData.getTitles().includes(name)) {
        this.view = 'magazinesYears';
        this.title = 'Czasopismo ' + name;
        this.years = this.xmlData.getYears(name);
      } else if (!name) {
        this.view = 'magazineList';
      } else {
        this.view = 'err';
        setTimeout(() => {
          this.router.navigate(['czasopisma']);
        }, 5000);
      }
    });
  }
}
