import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from '@shared/services/api/api.service';

@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.scss'],
})
export class InterestsComponent implements OnInit {
  @Input() item;
  @Input() color;
  @Input() type;
  @Input() width;
  @Input() height;
  @Input() image;
  @Input() size: string = '40px';
  idImage = '1';
  imgToshow = '';
  newHeight = 36;
  aspectRatio;

  constructor(
    private apiService: ApiService,
    private modalController: ModalController,
    private http: HttpClient
  ) {}

  ngOnChanges() {
    this.idImage = this.generateRandomCode(11);
    this.newHeight = parseInt(this.height);

    if (
      typeof this.image === 'object' &&
      this.image !== null &&
      !this.isBase64Image(this.image)
    ) {
      if (!this.image.url) {
        this.imgToshow = '';
        return;
      }

      if (this.image.url.includes('google')) {
        this.imgToshow = this.image.url;
      } else {
        this.loadImageFromMinio(this.image);
      }
    } else {
      const contentType = 'image/png';

      // const image = new Image();

      const img = new Image();

      img.src = this.image;

      img.onload = () => {
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;

        this.aspectRatio = imgWidth / imgHeight;
        this.imgToshow = this.image;
      };
    }
  }

  isBase64Image(data) {
    const base64Pattern = /^data:image\/(jpeg|png|gif);base64,/;
    return base64Pattern.test(data);
  }

  base64ToBlob(base64: string, contentType: string): Blob {
    let base = base64.replace('data:image/png;base64,', '');
    const byteCharacters = atob(base);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  closeModalWithoutThem() {
    this.modalController.dismiss({}, 'cancel');
  }

  ngOnInit() {
    if (this.type != 'txt') {
      if (this.image) {
        if (!this.image.url) {
          this.imgToshow = '';
          return;
        }
        if (this.image.url.includes('google')) {
          this.imgToshow = this.image.url;
        } else {
          this.loadImageFromMinio(this.image);
        }
      }
      var styleElem = document.head.appendChild(
        document.createElement('style')
      );
      if (this.item) {
        styleElem.innerHTML =
          '#' +
          this.item.id +
          ':before {height: ' +
          this.item.height +
          ';width: ' +
          this.item.width +
          ';}';
      }
    }
  }

  getImagePatternId(): string {
    // Generate a unique pattern ID based on the image URL or any other unique identifier

    return 'pattern-' + this.image;
  }

  loadImageFromMinio(imageUrl) {
    if (imageUrl) {
      this.aspectRatio = imageUrl.width / imageUrl.height;

      // Fetch the image from Minio
      this.http.get(imageUrl.url, { responseType: 'blob' }).subscribe(
        (response) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            // Convert the image to a data URL and store it in the imgToshow variable
            this.imgToshow = reader.result as string;
            this.imgToshow = this.imgToshow.replace(
              'data:application/octet-stream;',
              'data:image/png;'
            );
            const img = new Image();

            // Set the 'onload' event to get the image's height and width once it's loaded
          };

          reader.readAsDataURL(response);
        },
        (erreur: any) => {
          console.log(erreur);
          // this.apiService.displayMessage(erreur.error.error, "danger", "warning-outline")
        }
      );
    }
  }

  generateRandomCode(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }
  getStyle() {
    if (this.aspectRatio >= 1) {
      return { width: 'auto' };
    } else {
      return { height: 'auto', width: this.newHeight + 'px' };
    }
  }
}
