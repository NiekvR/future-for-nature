import { isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { environment } from '@env/environment';
import { AppComponent } from '@app/app.component';
import { provideRouter } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { CoreModule } from '@app/core/core.module';
import { JudgeModule } from '@app/judge/judge.module';
import { RouterModule } from '@angular/router';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
import { AdminModule } from '@app/admin/admin.module';
import { AuthenticationModule } from '@app/authentication/authentication.module';
import { routes } from '@app/app-routes';
import { NgxModalView, DefaultNgxModalOptionConfig, defaultNgxModalOptions } from 'ngx-modalview';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    CoreModule,
    JudgeModule,
    RouterModule,
    FontAwesomeModule,
    NgxModalView,
    AdminModule,
    AuthenticationModule,
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true // If set to true, the connection is established within the Angular zone
    }),

  ],
  providers: [
    provideRouter(routes),
    {
      provide: DefaultNgxModalOptionConfig,
      useValue: {...defaultNgxModalOptions, ...{ closeOnEscape: true, closeOnClickOutside: true }}
    },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
