import { Component, OnInit } from '@angular/core';
import { SetupService } from '../services/setup.service';
import { NavController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  infologin = {"username": "", "password": ""}
  responses: any;
  loginstatus: any;
  constructor(private setupservice: SetupService, private nav: NavController ) { }

  ngOnInit() {
  }

  login()
  {
    console.log(this.infologin);
    this.setupservice.postdata('login.php', this.infologin).subscribe(res => {
      this.responses = res;
      console.log(this.responses.status);
      this.loginstatus = this.responses.message;
      console.log(this.loginstatus);
      console.log(this.responses);
        this.responses = JSON.stringify(this.responses);
        localStorage.setItem("loginInfo", this.responses);
        this.nav.navigateForward('/home');
    }, (err: HttpErrorResponse) => {
      console.log(err.error);
      this.responses = err.error;
      alert(this.responses.message);
    });
  }
}
