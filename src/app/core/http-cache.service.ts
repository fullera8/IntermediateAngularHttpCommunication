import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpCacheService {

  private requests: any = {};

  constructor() { }

  //store a new request
  put(url: string, response: HttpResponse<any>): void {
    this.requests[url] = response;
  }

  //get existing request
  get(url: string): HttpResponse<any> | undefined {
    return this.requests[url];
  }

  //remove single entry
  invalidateUrl(url: string): void {
    this.requests[url] = undefined;
  }

  //remove all entries
  invalidateCache(): void {
    this.requests = {};
  }
}
