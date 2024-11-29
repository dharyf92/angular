import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { authInterceptorProviders } from '@core/interceptors/auth.interceptor';
import { IonicStorageModule } from '@ionic/storage-angular';
import { SharedModule } from '@shared/modules/shared-module/SharedModule.module';
import { ShareComponent } from '@views/modals/share/share.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FormsModule } from '@angular/forms';
import { HttpAuthGateway } from '@core/adpaters/http-auth.gateway';
import { HttpPostGateway } from '@core/adpaters/http-post.gateway';
import { HttpUserGateway } from '@core/adpaters/http-user.gateway';
import { AuthGateway } from '@core/ports/auth.gateway';
import { PostGateway } from '@core/ports/post.gateway';
import { UserGateway } from '@core/ports/user.gateway';
import { AuthState } from '@core/stores/auth/auth.state';
import { environment } from '@environments/environment';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { provideStore } from '@ngxs/store';
import { SuggestionModule } from '@views/modals/suggestion/suggestion.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, ShareComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      useSetInputAPI: true,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    CommonModule,
    FormsModule,
    SharedModule,
    SuggestionModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideStore(
      [AuthState],
      withNgxsStoragePlugin({
        keys: ['auth'],
      })
    ),
    { provide: AuthGateway, useFactory: () => new HttpAuthGateway() },
    { provide: UserGateway, useFactory: () => new HttpUserGateway() },
    { provide: PostGateway, useFactory: () => new HttpPostGateway() },
    authInterceptorProviders,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
