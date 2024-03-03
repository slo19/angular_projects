import { Component, inject } from '@angular/core';
import { Weather } from '../weather';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent {
  weather: Weather | undefined;
  private weatherService = inject(WeatherService);

  constructor(){}

  search(city: string) {
    this.weatherService
      .getWeather(city)
      .subscribe(weather => this.weather = weather);
  }
}
