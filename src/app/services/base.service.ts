import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { GlobalMessageService } from './global-message.service';

export abstract class BaseService {

    constructor(
        private router: Router,
        private client: HttpClient,
        private globalMessageService: GlobalMessageService
    ) { }

    protected request<T>(requestFunction: (client: HttpClient) => Observable<T>): Observable<T | null> {
        return requestFunction(this.client).pipe(
            catchError(error => this.handleError(error))
        );
    }

    private handleError(error: HttpErrorResponse): Observable<null> {
        if (error.status === 401) {
            this.logout().subscribe(() => this.router.navigate(['/login-github']));
        } else {
            this.globalMessageService.showFailureMessage(`An error occurred while communicating with the server. Error details: ${JSON.stringify(error.error)}`);
        }
        return of(null);
    }

    logout(): Observable<void> {
        return this.client.post<void>(`/logout`, {})
    }

}