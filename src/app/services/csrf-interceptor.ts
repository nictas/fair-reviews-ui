import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CsrfInterceptor implements HttpInterceptor {

    constructor() {
        console.log(`csrf-interceptor constructed`);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const csrfToken = this.getCookie('XSRF-TOKEN');
        console.log(`Retrieved CSRF token: ${csrfToken}`);
        if (csrfToken) {
            const cloned = req.clone({
                headers: req.headers.set('X-XSRF-TOKEN', csrfToken)
            });
            console.log(`Set X-CSRF-TOKEN header: ${JSON.stringify(cloned)}`);
            return next.handle(cloned);
        }
        return next.handle(req);
    }

    private getCookie(name: string): string | null {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
}