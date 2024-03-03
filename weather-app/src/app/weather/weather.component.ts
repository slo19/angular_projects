import { Component } from '@angular/core';
import { Weather } from '../weather';
import { WeatherService } '../weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent {
  weather: Weather | undefined;
  constructor(private weatherService: WeatherService){}

  search(city: string) {
    this.weatherService
      .getWeather(city)
      .subscribe(weather => this.weather = weather);
  }
}
