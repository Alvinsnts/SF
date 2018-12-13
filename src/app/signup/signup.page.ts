import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SetupService } from '../services/setup.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  responses: any;
  registerStatus: any;
  infosignup= {"username": "","email": "", "password": "", "role": ""}
  constructor(private setupservice: SetupService, private nav: NavController) { }

  ngOnInit() {
  }

  signup(){

    console.log(this.infosignup);
    this.setupservice.postdata('signup.php', this.infosignup).subscribe(res =>{

      this.responses = res;
      console.log(this.responses.status);
      this.registerStatus = this.responses.message;
      console.log(this.registerStatus);
      console.log(this.responses);
      if(this.registerStatus == "Register Success")
      {
        this.responses = JSON.stringify(this.responses);
        localStorage.setItem("logindata", this.responses);
        this.nav.navigateForward('/home');
      }
      else 
      {
        alert("Username already Exisst");
      }
    }, (err: HttpErrorResponse) => 
    {
      console.log(err.error);
      this.responses = err.error;
      alert(this.responses.message);
    });
  }
}
