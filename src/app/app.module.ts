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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularFireFunctionsModule, ORIGIN, USE_EMULATOR } from '@angular/fire/compat/functions';
import { DefaultSimpleModalOptionConfig, defaultSimpleModalOptions, SimpleModalModule } from 'ngx-simple-modal';
import { AdminModule } from '@app/admin/admin.module';
import { AuthenticationModule } from '@app/authentication/authentication.module';

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
    RouterModule,
    FontAwesomeModule,
    AngularFireFunctionsModule,
    AngularFireStorageModule,
    SimpleModalModule,
    AdminModule,
    AuthenticationModule
  ],
  providers: [
    // {
    //   provide: SETTINGS,
    //   useValue: environment.production ? undefined : {
    //     host: 'localhost:8080',
    //     ssl: false
    //   }
    // },
    // { provide: USE_EMULATOR, useValue: ['localhost', 5001] },
    {
      provide: DefaultSimpleModalOptionConfig,
      useValue: {...defaultSimpleModalOptions, ...{ closeOnEscape: true, closeOnClickOutside: true }}
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
