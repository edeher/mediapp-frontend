import { DialogoSignoComponent } from './../dialogo-signo/dialogo-signo.component';
import { MatSnackBar, MatDialog } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Paciente } from 'src/app/_model/paciente';
import { SignosService } from './../../../_service/signos.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Signos } from 'src/app/_model/signos';
import { PacienteService } from 'src/app/_service/paciente.service';
import * as moment from 'moment';
import { DialogoComponent } from '../../medico/dialogo/dialogo.component';



@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css']
})
export class SignosEdicionComponent implements OnInit {


  form: FormGroup;
  
  edicion: boolean;
  myControlPaciente: FormControl = new FormControl();
  
  pacientes: Paciente[]=[];

  id:number;
  nombreApellido:string;
  fechaSeleccionada: Date =new Date();
  maxFecha:Date=new Date();
  temperatura: string;
  pulso:string;
  ritmo:string;

  filteredOptions: Observable<any[]>;

  pacienteSeleccionado:Paciente;
 


  constructor( private signosService: SignosService, private pacienteService:PacienteService,private builder: FormBuilder, private snackBar: MatSnackBar,private router: Router, private routeAct:ActivatedRoute,private dialog:MatDialog) { }

  ngOnInit() {

    
    this.form=this.builder.group({
      'id':new FormControl(0),
      'paciente':this.myControlPaciente,
      'temperatura':new FormControl(''),
      'pulso':new FormControl(''),
      'ritmo':new FormControl(''),
      'fecha': new FormControl(new Date()),


    });
    
    
    this.routeAct.params.subscribe((params: Params)=>{
      this.id=params['id'];
     // this.nombreApellido=params['paciente'];
      this.edicion=this.id!=null;
      this.initForm();
      
     
    });
    this.listarPacientes();
    this.filteredOptions = this.myControlPaciente.valueChanges.pipe(map(val => this.filter(val)));
  
  }


initForm(){
  if(this.edicion){
    this.signosService.listarPorId(this.id).subscribe(data=>{
     // this.setValue(data.paciente);
      this.myControlPaciente.setValue(data.paciente);
      this.form=this.builder.group({
        'id':new FormControl(data.idSignos),
        'paciente':this.myControlPaciente,
        'temperatura':new FormControl(data.temperatura),
        'pulso':new FormControl(data.pulso),
        'ritmo':new FormControl(data.ritmo),
        'fecha': new FormControl(data.fecha),
        
      });
      
    });
  }
}



 listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

 
  filter(val: any) {
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || option.dni.includes(val.dni));
    } else {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.toLowerCase()) || option.apellidos.toLowerCase().includes(val.toLowerCase()) || option.dni.includes(val));
    }
  }
  displayFn(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }
  seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.option.value;
    console.log(this.pacienteSeleccionado);
  }




  aceptar() {
    
    let signos = new Signos();

    signos.idSignos=this.form.value['id'];
    signos.paciente = this.form.value['paciente']; 
    signos.temperatura = this.form.value['temperatura'];
    signos.pulso=this.form.value['pulso'];
    signos.ritmo=this.form.value['ritmo'];
    signos.fecha = moment(this.fechaSeleccionada).toISOString();


    if(this.edicion){
      this.signosService.modificar(signos).subscribe(()=>{
          this.signosService.listar().subscribe(data=>{
            this.signosService.signosCambio.next(data);
            this.signosService.mensajeCambio.next('SE MODIFICO')
          });
          this.limpiarControles();
          this.router.navigate(['signos']);
      });
    }else{
      this.signosService.registrar(signos).subscribe(() => {
        this.signosService.listar().subscribe(data=>{
          this.signosService.signosCambio.next(data);
        });
        this.snackBar.open("Se registró", "Aviso", { duration: 2000 });
  
       
          this.limpiarControles();
       
        this.router.navigate(['signos']);
      });
    }


    
  }
  estadoBotonRegistrar() {
    return (this.pacienteSeleccionado === null);
  }

  limpiarControles() {
    this.pacienteSeleccionado = null;
    this.temperatura='';
    this.pulso='';
    this.ritmo='';
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
   
  }
  
  openDialog(){
    this.dialog.open(DialogoSignoComponent,{
      width:'300px'
    }).afterClosed().subscribe(result=>{
        this.listarPacientes();
    });
  }

}
