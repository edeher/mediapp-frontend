import { LoginComponent } from './login/login.component';
import { Menu } from './_model/menu';
import { MenuService } from './_service/menu.service';
import { LoginService } from './_service/login.service';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TOKEN_NAME } from './_shared/var.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  menus: Menu[] = [];
  user12:string;
  roles: string[]=[];
 
  
  constructor(public loginService : LoginService, private menuService : MenuService){
  }

  ngOnInit(){
    this.menuService.menuCambio.subscribe(data => {
      this.menus = data;
      if(this.menus.length!=null){
        this.cargaruser();
      }

    });
     

  }
  cargaruser(){
    
        const helper = new JwtHelperService();
        let rpta = this.loginService.estaLogeado();
        let tk = JSON.parse(sessionStorage.getItem(TOKEN_NAME));
      
        const decodedToken = helper.decodeToken(tk.access_token);
        this.user12=decodedToken.user_name;
        this.roles=decodedToken.authorities;
      
  }


  }
