import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.openweathermap.org/data/2.5/';
  private apiKey = '';
  constructor() { }
}
