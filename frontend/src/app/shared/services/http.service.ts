import { environment } from './../../environments/environment';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Http {
  private environment = environment.api;
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  /**
   * HTTP Get request function
   *
   * @param {{}} url URL to be accessed
   * @param {{}} TypeGet Type of object to be returned. Example: User
   *
   *
   */

  public get<T>(url: string, options?: any): Observable<T> {
    const _url: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.environment + url
    );

    const _securityUrl: string = this.sanitizer.sanitize(5, _url) as string;
    return this.http
      .get<T>(_securityUrl, options)
      .pipe(retry(3)) as Observable<T>;
  }

  public getExternal<T>(url: string, options?: any): Observable<any> {
    const _safeResourceUrl: SafeResourceUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(url);
    const _safeUrl: string = this.sanitizer.sanitize(
      5,
      _safeResourceUrl
    ) as string;
    return this.http.get<T>(_safeUrl, options);
  }

  public getText<T>(url: string, options?: any): Observable<any> {
    const _safeResourceUrl: SafeResourceUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(this.environment + url);
    const _safeUrl: string = this.sanitizer.sanitize(
      5,
      _safeResourceUrl
    ) as string;
    let obj: any = {};
    if (options) {
      obj = options;
      obj.responseType = 'text' as 'json';
    } else obj = { responseType: 'text' as 'json' };

    return this.get<T>(_safeUrl, obj);
  }

  public getBlob<T>(url: string, options?: any): Observable<any> {
    const _safeResourceUrl: SafeResourceUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(this.environment + url);
    const _safeUrl: string = this.sanitizer.sanitize(
      5,
      _safeResourceUrl
    ) as string;

    let obj: any = {};
    if (options) {
      obj = options;
      obj.responseType = 'text' as 'blob';
    } else obj = { responseType: 'text' as 'blob' };

    return this.get<T>(_safeUrl, obj);
  }

  /**
   * HTTP POST request function
   *
   * @param {{}} url URL to be accessed
   * @param {{}} data Object to be sent
   * @param {{}} SendType Type of object to be sent. Example: AuthLogin
   * @param {{}} ReturnType Type of object to be returned. Example: AuthReturn
   *
   */
  public post<SendType, ReturnType>(
    url: string,
    data: SendType,
    options?: any
  ): Observable<ReturnType> {
    // let _responseType = returnText ? ('text' as 'json') : 'json';

    const _safeResourceUrl: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(
      this.environment + url
    );
    const _safeUrl: string = this.sanitizer.sanitize(
      4,
      _safeResourceUrl
    ) as string;
    return (
      this.http.post<ReturnType>(
        _safeUrl,
        data,
        options
      ) as Observable<ReturnType>
    )
  }

  /**
   * HTTP PATCH request function
   *
   * @param {{}} url URL to be accessed
   * @param {{}} data Object to be sent
   * @param {{}} SendType Type of object to be sent. Example: AuthLogin
   * @param {{}} ReturnType Type of object to be returned. Example: AuthReturn
   *
   */
  public patch<SendType, ReturnType>(
    url: string,
    data: SendType,
    returnText?: boolean
  ): Observable<ReturnType> {
    let _responseType = returnText ? ('text' as 'json') : 'json';

    const _safeResourceUrl: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(
      this.environment + url
    );
    const _safeUrl: string = this.sanitizer.sanitize(
      4,
      _safeResourceUrl
    ) as string;
    return this.http
      .patch<ReturnType>(_safeUrl, data, {
        responseType: _responseType,
      })
  }
  /**
   *  HTTP PUT request function
   *
   * @param {{}} url URL to be accessed
   * @param {{}} SendType Type of object to be returned. Example: User
   *
   */
  public put<SendType, ReturnType>(
    url: string,
    data: SendType,
    options?: any
  ): Observable<any> {
    const _safeResourceUrl: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(
      this.environment + url
    );
    const _safeUrl: string = this.sanitizer.sanitize(
      4,
      _safeResourceUrl
    ) as string;
    return this.http
      .put<ReturnType>(_safeUrl, data, options)
  }
  /**
   *  HTTP Delete request function
   *
   * @param {{}} url URL to be accessed
   *
   */
  public delete(url: string, options?: { headers?: HttpHeaders }): Observable<boolean> {
    const _safeResourceUrl: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(
      this.environment + url
    );
    const _safeUrl: string = this.sanitizer.sanitize(
      4,
      _safeResourceUrl
    ) as string;
    return this.http.delete<boolean>(_safeUrl);
  }
}
