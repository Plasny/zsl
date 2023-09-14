import { Injectable } from '@angular/core';
import * as xml2js from 'xml2js';

type t = {
  czasopisma: {
    [key: string]: {
      [key: string]: {
        $: {
          rok: string;
          brak?: string;
        };
        format: string;
        miniaturka: string;
        nazwa: string;
        number: string;
        plik: string;
        podeslal: string;
        przetworzenie: string;
        skan: string;
        stron: string;
        wydawca: string;
      };
    };
    // @ts-ignore
    lata: {
      [key: string]: string;
    };
    // @ts-ignore
    zmienne: {
      [key: string]: {
        src: string;
        klik: string;
      };
    };
  };
};

@Injectable({
  providedIn: 'root',
})
export class xmlData {
  private xml?: t;

  async init() {
    if (this.xml) return;

    const parser = new xml2js.Parser({ explicitArray: false });
    const res = await fetch('./assets/czasopisma.xml').then((res) =>
      res.text()
    );
    parser.parseString(res, (err, xml) => {
      this.xml = xml as t;
    });

    const baseImgUrl = 'https://atarionline.pl/biblioteka/czasopisma/img/';
    Object.values(this.xml!.czasopisma.zmienne).map((el) => {
      el.src = baseImgUrl + el.src;
      return el;
    });

    const baseResUrl = 'https://atarionline.pl/biblioteka/czasopisma/';
    Object.keys(this.xml!.czasopisma.zmienne).forEach((key) => {
      Object.values(this.xml!.czasopisma[key]).forEach((el) => {
        el.plik = baseResUrl + key + '/' + el.plik;
        el.miniaturka = baseResUrl + key + '/' + el.miniaturka;
        return el;
      });
    });
  }

  getTitles(): string[] {
    return Object.keys(this.xml!.czasopisma.zmienne);
  }

  getImgList(): { src: string; klik: string }[] {
    return Object.values(this.xml!.czasopisma.zmienne);
  }

  getYears(title: string): string[] {
    if (!this.xml!.czasopisma.lata[title]) return [];

    const list = this.xml!.czasopisma.lata[title].split(',');
    return list;
  }

  getMagazines(title: string, year?: string) {
    if (!this.xml!.czasopisma.lata[title] || !this.xml!.czasopisma[title])
      return [];

    let magazines = Object.values(this.xml!.czasopisma[title]).filter(
      (el) => el.$.brak === undefined
    );

    if (year === undefined) return magazines;

    return magazines.filter((el) => el.$.rok === year);
  }
}
