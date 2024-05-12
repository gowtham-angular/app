import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpRequest,
    HttpInterceptor,
    HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UtilsService } from './utils.service';


@Injectable()
export class HttpsInterceptor implements HttpInterceptor {

    constructor(private loadingService?: UtilsService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const isHttps = req.url.startsWith('https://');

        if (isHttps) {
            if (this.loadingService) {
                this.loadingService.setLoading(true);
            }
            // You can optionally modify the request here
            return next.handle(req)
                .pipe(
                    tap(event => {
                        if (event instanceof HttpResponse) {
                            if (this.loadingService) {
                                this.loadingService.setLoading(false);
                            }
                        }
                    }, error => {
                        // Handle errors
                        if (this.loadingService) {
                            this.loadingService.setLoading(false);
                        }
                    })
                );
        }

        return next.handle(req);
    }
}