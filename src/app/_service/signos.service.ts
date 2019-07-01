import { Subject } from 'rxjs';
import { HOST } from './../_shared/var.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable, Host } from '@angular/core';
import{Signos} from '../_model/signos';

@Injectable({
  providedIn: 'root'
})
export class SignosService {

  signosCambio= new Subject<Signos[]>();
  mensajeCambio=new Subject<string>();
  url : string=HOST;


  constructor(private http:HttpClient ) { }

  listar(){
    return this.http.get<Signos[]>(`${this.url}/signos`);
  }

  listarPorId(idSignos:number){
    return this.http.get<Signos>(`${this.url}/signos/${idSignos}`);
  }

  registrar(signos:Signos){
    return this.http.post(`${this.url}/signos`,signos);
  }

  modificar(signos:Signos){

    return this.http.put(`${this.url}/signos`,signos);
  }

  eliminar (idSignos:number){
    return this.http.delete(`${this.url}/signos/${idSignos}`);
  }
  listarPageable(p: number, s: number) {
    return this.http.get(`${this.url}/signos/pageable?page=${p}&size=${s}`);
  }
}
