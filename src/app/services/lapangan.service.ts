import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { IPagination } from '../interfaces/i-pagination';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { ILapangan } from '../interfaces/i-lapangan';

@Injectable({
  providedIn: 'root'
})
export class LapanganService {

  baseUrl: string = environment.baseUrl;
  

  constructor(private http: HttpClient) { }

  getAllLapangan(pagination: IPagination): Observable<any> {
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString())
      .set('searchTerm', pagination.searchTerm || '');

    return this.http.get(`${this.baseUrl}/api/adm/l/all`, { params }).pipe(
      tap(data => console.log('Data received from the API:', data)),
      catchError(error => {
        console.error('Error fetching data from the API', error);
        return throwError(() => new Error('Error fetching data'));
      })
    );
  }

  createLapangan(lapangan: ILapangan): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/adm/l/create`, lapangan);
  }

  editLapangan(id: number, lapangan: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/adm/l/edit/${id}`, lapangan);
  }

  deleteLapangan(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/adm/l/delete/${id}`).pipe(
        tap(data => console.log('Delete response:', data)),
        catchError(error => {
            console.error('Delete operation failed', error);
            return throwError(() => new Error('Deletion failed'));
        })
    );
  }


}
