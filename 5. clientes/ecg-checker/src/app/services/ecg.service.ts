import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EcgService {

  constructor(private http: HttpClient) { }

  // Creamos función post para generar en automatico trazos ecc con la cloud function insertECGTrace
  // Pasamos el Id del usuario del storage

  getECGTraces(userId: string): Observable<any> {
    return this.http.get<any>(`https://us-central1-fleet-impact-385817.cloudfunctions.net/getECGTraces?userId=${userId}`);
  }
  insertECGTrace(userId: string): Observable<any> {
    return this.http.post<any>(`https://us-central1-fleet-impact-385817.cloudfunctions.net/insertECGTrace`, { userId });
  }
  getECGResults(userId: string): Observable<any> {
    return this.http.get<any>(`https://us-central1-fleet-impact-385817.cloudfunctions.net/getResults?userId=${userId}`);
  }
  analyzeNewECGTrace(traceId: string): Observable<any> {
    console.log('EcG trace ', traceId);
    return this.http.post<any>(`https://us-central1-fleet-impact-385817.cloudfunctions.net/analyzeECGTrace`, { traceId });
  }
  analyzeNewECGMulti(userId: string, ecgTrace: any): Observable<any> {
    // Verificamos si ecgTrace es un string o una lista
    if (typeof ecgTrace === 'string') {
      console.log('es string', ecgTrace);
      return this.http.post<any>(`https://us-central1-fleet-impact-385817.cloudfunctions.net/analyzeNewECGImage`, { userId, ecgTrace });
    } else {
      console.log('es lista', ecgTrace);
      return this.http.post<any>(`https://us-central1-fleet-impact-385817.cloudfunctions.net/analyzeNewECGTrace`, { userId, ecgTrace });
    }

  }

}
