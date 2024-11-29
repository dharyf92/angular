import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SaveLinkBody } from '@core/models/post.model';
import { environment } from 'src/environments/environment';

const TOKEN_KEY = 'credentials';
const USER_KEY = 'auth-user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private http: HttpClient) {}
  sharedData;

  public verifyToken(): any {
    return this.http.get(environment.apiUrl + 'auth/verify-token', httpOptions);
  }

  async getMetaData(url: string): Promise<any> {
    // Encode the URL to ensure it's properly formatted for the API request
    const encodedUrl = encodeURIComponent(url);
    console.log(encodedUrl);

    return fetch(
      `https://opengraph.io/api/1.1/site/${encodedUrl}?app_id=${environment.opengraphToken}`
    ).then((res) => res.json());
  }

  saveMetaData(data: SaveLinkBody) {
    return this.http.post(
      environment.serverUrl + '/api/save',
      data,
      httpOptions
    );
  }

  scrapeMetaData(data) {
    return this.http.post(
      environment.apiUrl + 'scrape-link',
      data,
      httpOptions
    );
  }
}
