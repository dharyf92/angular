import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserGateway } from '@core/ports/user.gateway';

export class HttpUserGateway implements UserGateway {
  private readonly http = inject(HttpClient);
}
