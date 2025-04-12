import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';

import { AppComponent } from './app.component';
import { HistorialClinicoComponent } from './components/registros-medicos/historial-clinico/historial-clinico.component';
import { SignosVitalesComponent } from './components/registros-medicos/signos-vitales/signos-vitales.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatExpansionModule,
    AppComponent,
    HistorialClinicoComponent,
    SignosVitalesComponent
  ],
  providers: []
})
export class AppModule { } 