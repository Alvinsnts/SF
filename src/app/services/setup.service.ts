import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


const apiUrl = 'http://smartfrenmapping.xyz/api/product';
@Injectable({
  providedIn: 'root'
})
export class SetupService {

  constructor( private http: HttpClient) { }

  postdata(url, credential){
    return this.http.post(`${apiUrl}/${url}`, JSON.stringify(credential), {});
  }
  uploadImage(url,credentials){
    return this.http.post(`${apiUrl}/${url}`, credentials, {});
  }
}

