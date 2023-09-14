import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AppComponent } from './app.component';
import { CzasopismaComponent } from './pages/czasopisma.component';
import { StartComponent } from './pages/start.component';
import { OpisCzasopismaComponent } from './pages/opisCzasopisma.commponent';

const routes: Routes = [
  {path: "", component: StartComponent},
  {path: "czasopisma", component: CzasopismaComponent},
  {path: "czasopisma/:name", component: CzasopismaComponent},
  {path: "czasopisma/:name/:year", component: OpisCzasopismaComponent},
  {path: "**", redirectTo: "/czasopisma", pathMatch: "full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
