import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { HttpCacheService } from 'app/core/http-cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  constructor(private cacheService: HttpCacheService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //pass non-cache requests and invalidate cache
    if (req.method !== 'GET') {
      console.log(`Invalidating cahce: ${req.method} ${req.url}`);
      this.cacheService.invalidateCache();
      return next.handle(req);
    }

    //retrieve cached responses
    let cachedResponse: HttpResponse<any> = this.cacheService.get(req.url);

    //return cached responses
    if (cachedResponse) {
      console.log(`Returning cached response: ${cachedResponse.url}`);
      console.log(cachedResponse);
      return of(cachedResponse); //same as next.handle without the 'next' operator. Just shorthand if there is one unmutable response.
    }

    //send request to server to add responses to the cache
    return next.handle(req)
      .pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            console.log(`Adding response to cache: ${req.url}`);
            this.cacheService.put(req.url, event);
          }
        })
      );

  }

}
