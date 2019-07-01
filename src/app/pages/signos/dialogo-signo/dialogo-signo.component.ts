import { PacienteService } from './../../../_service/paciente.service';
import { MatDialogRef } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { Paciente } from 'src/app/_model/paciente';

@Component({
  selector: 'app-dialogo-signo',
  templateUrl: './dialogo-signo.component.html',
  styleUrls: ['./dialogo-signo.component.css']
})
export class DialogoSignoComponent implements OnInit {


  paciente:Paciente;
  constructor(private dialogRef: MatDialogRef<DialogoSignoComponent>, private pacienteService:PacienteService) { }

  ngOnInit() {
    this.paciente = new Paciente();
  }


  operar(){
    this.pacienteService.registrar(this.paciente).subscribe(data => {
      this.pacienteService.listar().subscribe(pacientes => {
        this.pacienteService.pacienteCambio.next(pacientes);
        this.pacienteService.mensajeCambio.next("Se registro");
      });
    });
    this.dialogRef.close();
  }
  cancelar() {
    this.dialogRef.close();
  }
}
