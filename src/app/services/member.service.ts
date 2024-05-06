import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { IPagination } from '../interfaces/i-pagination';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllMember(pagination: IPagination): Observable<any> {
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString())
      .set('searchTerm', pagination.searchTerm || '');

    return this.http.get(`${this.baseUrl}/api/u/member`, { params }).pipe(
      tap(data => console.log('Data received from the API:', data)),
      catchError(error => {
        console.error('Error fetching data from the API', error);
        return throwError(() => new Error('Error fetching data'));
      })
    );
  }

  editMember(id: number, member: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/u/edit/${id}`, member);
  }

  deleteMember(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/u/delete/${id}`).pipe(
        tap(data => console.log('Delete response:', data)),
        catchError(error => {
            console.error('Delete operation failed', error);
            return throwError(() => new Error('Deletion failed'));
        })
    );
  }
}
