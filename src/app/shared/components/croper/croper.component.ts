import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController, NavParams } from '@ionic/angular';
import {
  ImageCropperComponent,
  ImageTransform,
  LoadedImage,
} from 'ngx-image-cropper';

@Component({
  selector: 'app-croper',
  templateUrl: './croper.component.html',
  styleUrls: ['./croper.component.scss'],
})
export class CroperComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  myImage = null;
  transform: ImageTransform = {};
  zoom = 0;
  value = 0;
  rangeValue = 0;
  step = 0.25;
  min = -90;

  max = 90;
  choice = 'rotate';
  @ViewChild('cropper') cropper: ImageCropperComponent;
  constructor(
    private sanitizer: DomSanitizer,
    private modalController: ModalController,
    private navParams: NavParams
  ) {
    this.myImage = this.navParams.get('image');
  }

  ngOnInit() {}

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  // imageCropped(event: ImageCroppedEvent) {
  //   this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
  //   // event.blob can be used to upload the cropped image
  // }
  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  cropImage() {
    this.croppedImage = this.cropper.crop('base64').base64;
    this.modalController.dismiss({ image: this.croppedImage });
  }

  ionViewDidLeave() {}

  customFormatter(event) {
    this.value = event.detail.value;
    if (this.choice == 'scale') {
      this.updatePicture('zoom');
    }
    if (this.choice == 'rotate') {
      this.updatePicture('rotate');
    }

    // Use the rangeValue here
  }

  closeModalWithoutThem() {
    this.modalController.dismiss({}, 'cancel');
  }

  selctOption(value) {
    this.choice = value;
    if (this.choice == 'scale') {
      this.value = 1;
      this.min = 0;
      this.max = 10;
    }
    if (this.choice == 'rotate') {
      this.value = 0;
      this.min = -90;
      this.max = 90;
    }
  }
  updatePicture(option) {
    if (option == 'rotate') {
      this.transform = {
        ...this.transform,
        rotate: this.value,
      };
    } else if (option == 'flipH') {
      this.transform = {
        ...this.transform,
        flipH: !this.transform.flipH,
      };
    } else if (option == 'flipV') {
      this.transform = {
        ...this.transform,
        flipV: !this.transform.flipV,
      };
    } else if (option == 'zoom') {
      this.transform = {
        ...this.transform,
        scale: this.value,
      };
    }
    // else if(option == 'zoomOut'){
    //   this.zoom = this.zoom + this.value;
    // //  const newValue = ((this.transform.rotate ?? 0) + 90) % 360;
    //  this.transform = {
    //   ...this.transform,scale:this.zoom
    //  }
    // }
  }
}
