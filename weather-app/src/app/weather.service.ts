import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Weather } from './weather';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.openweathermap.org/data/2.5/';
  private apiKey = '';
  constructor() { }

  getWeather(city: string): Observable<Weather> {
    const options = new HttpParams()
      .set('units', 'metric')
      .set('q', city)
      .set('appId', this.apiKey);
    return this.http.get<Weather>(this.apiUrl + weather, {params: options});
  }
}
