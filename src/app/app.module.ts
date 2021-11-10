import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from '@env/environment';
import { AppComponent } from '@app/app.component';
import { AppRoutingModule } from '@app/app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { CoreModule } from '@app/core/core.module';
import { JudgeModule } from '@app/judge/judge.module';
import { RouterModule } from '@angular/router';
import { SETTINGS } from '@angular/fire/compat/firestore';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    CoreModule,
    JudgeModule,
    RouterModule
  ],
  providers: [
    {
      provide: SETTINGS,
      useValue: environment.production ? undefined : {
        host: 'localhost:8080',
        ssl: false
      }
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
