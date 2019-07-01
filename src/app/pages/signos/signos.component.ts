import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { SignosService } from './../../_service/signos.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Signos } from 'src/app/_model/signos';


@Component({
  selector: 'app-signos',
  templateUrl: './signos.component.html',
  styleUrls: ['./signos.component.css']
})
export class SignosComponent implements OnInit {

  

  displayedColumns=['idSignos','temperatura','pulso','ritmo','paciente','fecha','acciones'];

  dataSource:MatTableDataSource<Signos>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  cantidad: number;

  constructor(private signosService : SignosService, private snackBar: MatSnackBar) { 

    
  }

  ngOnInit() {
    this.listar();

    this.signosService.signosCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.signosService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });
    
  }

  listar(){
    this.pedirPaginado();
  }

  eliminar(idSignos: number){

    this.signosService.eliminar(idSignos).subscribe(()=>{
      this.signosService.listar().subscribe(data=>{
        this.signosService.signosCambio.next(data);
        this.signosService.mensajeCambio.next('SE ELIMINO');
      });
    });
  }

  mostrarMas(e: any) {
    this.pedirPaginado(e);
  }
  pedirPaginado(e?: any) {
    let pageIndex = 0;
    let pageSize = 10;

    if (e != null) {
      pageIndex = e.pageIndex;
      pageSize = e.pageSize;      
    }

    this.signosService.listarPageable(pageIndex, pageSize).subscribe((data: any) => {
      let signos = data.content;
      this.cantidad = data.totalElements;

      this.dataSource = new MatTableDataSource(signos);
      //this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

}
