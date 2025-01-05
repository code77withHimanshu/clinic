import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:3000/api/doctors';

  constructor(private http: HttpClient) { }

  getDoctors(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addDoctor(newDoctor: any): Observable<any> {
    return this.http.post(this.apiUrl, newDoctor);
  }

  deleteDoctor(doctorId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${doctorId}`);
  }
}
