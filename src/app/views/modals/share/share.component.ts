import { Component, input, OnInit } from '@angular/core';
import { SaveLinkBody } from '@core/models/post.model';
import { ModalController } from '@ionic/angular';
import { ApiService } from '@shared/services/api/api.service';
import { PostsService } from '@shared/services/posts/posts.service';
import { TokenService } from '@shared/services/token/token.service';
import { tryit } from 'radash';
import { Intent } from 'send-intent';
import { environment } from 'src/environments/environment';
import { z } from 'zod';
import { ThemesComponent } from '../themes/themes.component';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
})
export class ShareComponent implements OnInit {
  intent = input.required<{ data: Intent; isImg: boolean }>({ alias: 'data' });
  data: any;
  keys;
  image;
  allData: SaveLinkBody['link_metadata'];
  themes;
  theme;
  isLoaded = false;

  constructor(
    private apiService: ApiService,
    private modalController: ModalController,
    private postsService: PostsService,
    private tokenService: TokenService
  ) {}

  async ionViewWillEnter() {
    if (this.intent().isImg) {
      this.apiService.displayMessage(
        'The provided data not supported. Please try again.',
        'danger',
        'warning-outline'
      );
      this.closeModal();
    } else {
      const urlSchema = z.string().url();
      const safeParse = urlSchema.safeParse(this.intent().data.url);

      console.log({ safeParse });

      if (safeParse.success) {
        const url = safeParse.data;
        console.log('url', url);

        const [err, result] = await tryit(this.tokenService.getMetaData)(url);

        console.log('err', err);
        console.log('result', result);

        if (err) {
          console.error(err);
          this.apiService.displayMessage(
            `The provided data not supported. Please try again., ${err}`,
            'danger',
            'warning-outline'
          );
          // this.closeModal();
        }

        console.log('result', result);

        if (result) {
          this.data = result.hybridGraph;
          this.allData = result.hybridGraph;
          console.log('data', this.allData);
          console.log('result', result);
          if (this.data.image) {
            this.image = this.data.image;
            delete this.data.image;
          }
          if (this.data.favicon) {
            delete this.data.favicon;
          }
          if (this.data.type) {
            delete this.data.type;
          }
          if (this.data.products) {
            delete this.data.products;
          }
          this.keys = Object.keys(this.data);
          this.isLoaded = true;
          console.log('this.allData.site_name', this.allData.site_name);
          if (environment.linksScrap.indexOf(this.allData.site_name) >= 0) {
            let provider = '';
            if (url.includes('a.co')) {
              provider = 'amazon';
            }
            if (this.data.site_name) {
              provider = this.data.site_name.toLowerCase();
            }
            let data = {
              url: this.data.url,
              provider: provider,
            };
            console.log('taha request', data);
            this.tokenService.scrapeMetaData(data).subscribe(
              (res) => {
                console.log('res taha', res);
              },
              (erreur: any) => {
                this.apiService.displayMessage(
                  erreur.error.error,
                  'danger',
                  'warning-outline'
                );
              }
            );
          }
        }
      } else {
        console.log('not img');
      }
    }
  }

  ngOnInit() {}

  async choiceTheme() {
    this.postsService.getThemes().subscribe(
      async (res) => {
        this.themes = res;
        console.log(this.themes);
        const modal = await this.modalController.create({
          component: ThemesComponent,
          // Optional: Pass data to the modal
          componentProps: {
            themes: this.themes,
          },
        });
        modal.onDidDismiss().then((result) => {
          console.log(result);
          if (result.role === 'cancel') {
            console.log('Modal dismissed');
            this.theme = null;
          } else {
            this.theme = result.data.theme;
          }
        });
        await modal.present();
      },
      (erreur: any) => {
        this.apiService.displayMessage(
          erreur.error.error,
          'danger',
          'warning-outline'
        );
      }
    );
  }

  done() {
    if (!this.theme) {
      this.apiService.displayMessage(
        'Please choose a theme',
        'danger',
        'warning-outline'
      );
    }
    let data: SaveLinkBody = {
      link_url: this.data.url,
      image_url: this.image,
      provider: this.data.site_name,
      link_metadata: this.allData,
      category_id: this.theme.id,
    };

    this.tokenService.saveMetaData(data).subscribe(
      (res) => {
        console.log('res hhh ', res);
        this.closeModal();
      },
      (erreur: any) => {
        this.apiService.displayMessage(
          erreur.error.error,
          'danger',
          'warning-outline'
        );
      }
    );

    console.log('data hhh ', data);
  }

  closeModal() {
    this.modalController.dismiss({}, 'cancel');
  }
}
