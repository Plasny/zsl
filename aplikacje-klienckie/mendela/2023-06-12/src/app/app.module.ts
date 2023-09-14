import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartComponent } from './pages/start.component';
import { xmlData } from './xmlData.service';
import { CzasopismaComponent } from './pages/czasopisma.component';
import { OpisCzasopismaComponent } from './pages/opisCzasopisma.commponent';

export function setupXML(setup: xmlData) {
  return async () => await setup.init();
}

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    CzasopismaComponent,
    OpisCzasopismaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: setupXML,
      deps: [xmlData],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
