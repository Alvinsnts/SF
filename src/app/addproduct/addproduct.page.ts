import { Component, OnInit } from '@angular/core';

import { NavController } from '@ionic/angular';
import { SetupService } from '../services/setup.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.page.html',
  styleUrls: ['./addproduct.page.scss'],
})
export class AddproductPage implements OnInit {

  responses: any;
  productStatus: any;
  productinfo= {"productname": "", "productprice": "", "producttype": "", "productdetail": ""}
  constructor(private setupservice: SetupService, private nav: NavController) { }

  ngOnInit() {
  }

  addproduct(){

    console.log(this.productinfo);
    this.setupservice.postdata('addproduct.php', this.productinfo).subscribe(res =>{

      this.responses = res;
      console.log(this.responses.status);
      this.productStatus = this.responses.message;
      console.log(this.productStatus);
      console.log(this.responses);
        this.responses = JSON.stringify(this.responses);
        localStorage.setItem("productdata", this.responses);
        this.nav.navigateForward('/home');
    }, (err: HttpErrorResponse) => 
    {
      console.log(err.error);
      this.responses = err.error;
      alert(this.responses.message);
    });
  }

}