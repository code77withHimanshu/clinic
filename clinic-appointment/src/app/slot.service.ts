import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';  // Import HttpClient

@Injectable({
  providedIn: 'root'
})
export class SlotService {

  // Define the base URL of the API (adjust to your backend's URL)
  private baseUrl = 'http://localhost:3000/api/slots';

  constructor(private http: HttpClient) { }

  // Method to get the slots data from backend
  getSlots(): Observable<any> {
    // Make an HTTP GET request to the backend API
    return this.http.get<any>(this.baseUrl);
  }

  // Method to update a specific slot by its time and period
  updateSlot(period: string, time: string, updatedSlot: any): Observable<any> {
    const url = `${this.baseUrl}/update`;  // Custom endpoint for updating slot
    return this.http.put<any>(url, { period, time, updatedSlot });  // Send PUT request
  }
}
