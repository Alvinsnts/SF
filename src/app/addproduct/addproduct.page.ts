import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType} from '@ionic-native/Camera/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';

import { NavController } from '@ionic/angular';
import { SetupService } from '../services/setup.service';
import { HttpErrorResponse } from '@angular/common/http';

import { finalize } from 'rxjs/operators';

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.page.html',
  styleUrls: ['./addproduct.page.scss'],
})
export class AddproductPage implements OnInit {

  images = {"imagePath" : "http://smartfrenmapping.xyz/api/uploads/", "convertedImagePath" : "http://smartfrenmapping.xyz/api/uploads/"};

  responses: any;
  productStatus: any;
  productinfo= {"productname": "", "productprice": "", "producttype": "", "productdetail": ""}
  constructor(private setupservice: SetupService, private nav: NavController, private camera: Camera, private file: File, private http: HttpClient, private webview: WebView,
    private actionSheetController: ActionSheetController, private toastController: ToastController,
    private storage: Storage, private plt: Platform, private loadingController: LoadingController,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    
  }

  addproduct(){
    /*
    this.file.resolveLocalFilesystemUrl(this.images.imagePath)
    .then(entry => {
      (<FileEntry>entry).file(file => this.readFile(file))
    })
    .catch(err => {
      console.log('Error while reading file.');
    }); */

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

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }
  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imagePath => {
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      // imagePath result = file:///storage/emulated/0/Android/data/io.ionic.starter/cache/1544422196041.jpg
      // correctPath result = 
      // current name result = 1544422196041.jpg
      console.log("imagePath: " + imagePath);
      var convertedImagePath = this.webview.convertFileSrc(imagePath);
      console.log("convertedImagePath: " + convertedImagePath);
      this.images.imagePath = imagePath;
      this.images.convertedImagePath = convertedImagePath;

      console.log(this.images);

      localStorage.setItem("images", JSON.stringify(this.images));
      this.ref.detectChanges();
    });
  }

  startUpload() {
    this.file.resolveLocalFilesystemUrl(this.images.imagePath)
      .then(entry => {
        (<FileEntry>entry).file(file => this.readFile(file))
      })
      .catch(err => {
        console.log('Error while reading file.');
      });
  }

  readFile(file: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      formData.append('file', imgBlob, file.name);
      this.uploadImageData(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  async uploadImageData(formData: FormData) {
    const loading = await this.loadingController.create({
      message: 'Uploading image...',
    });
    await loading.present();

    this.setupservice.uploadImage("upload.php", formData)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe(res => {
        if (res['success']) {
          console.log('File upload complete.')
        } else {
          console.log('File upload failed.')
        }
      });
  }

}