import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather',
  imports: [CommonModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  currentTemp: number | null = null;
  hourlyForecast: { date: string, weather: string, temp: string, humidity: string, minTemp: string, maxTemp: string }[] = [];
  apiKey = '2781abe82a08b61511fe4718bac9785b'; 
  lat = 28.57;
  lon = 77.32;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchWeatherData();
    this.fetchHourlyForecast();
  }

  fetchWeatherData(): void {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lon}&appid=${this.apiKey}&units=metric`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.currentTemp = data.main.temp; // Extract current temperature
      },
      error: (err) => {
        console.error('Error fetching weather data:', err);
      }
    });
  }

  fetchHourlyForecast(): void {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${this.lat}&lon=${this.lon}&appid=${this.apiKey}&units=metric`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        // Get the forecast for the next 5 days, 3-hour intervals
        this.hourlyForecast = data.list.slice(0, 42).map((item: any) => ({
          date: this.formatDate(item.dt),
          weather: item.weather[0].main,
          temp: `${item.main.temp}°C`,
          humidity: `${item.main.humidity}%`,
          minTemp: `${item.main.temp_min}°C`,
          maxTemp: `${item.main.temp_max}°C`,
        }));
      },
      error: (err) => {
        console.error('Error fetching hourly forecast:', err);
      }
    });
  }

  // Format timestamp to Date and Time (e.g., 15/12/2024 10:00 AM)
  formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
    const formattedDate = `${date.getDate() < 10 ? '0' : ''}${date.getDate()}/${date.getMonth() + 1 < 10 ? '0' : ''}${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
    return formattedDate;
  }
}
