import { Component, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ApiService } from '@shared/services/api/api.service';
import { PostsService } from '@shared/services/posts/posts.service';

@Component({
  selector: 'app-report-pop-up',
  templateUrl: './report-pop-up.component.html',
  styleUrls: ['./report-pop-up.component.scss'],
})
export class ReportPopUpComponent {
  @Input() post;

  reportCauses: string[] = [
    'Spam',
    'Inappropriate Content',
    'Harassment',
    'Other',
  ];
  selectedCause: string;

  constructor(
    private apiService: ApiService,
    private modalController: ModalController,
    private postsService: PostsService,
    private toastController: ToastController
  ) {}

  closePopUp() {
    this.modalController.dismiss({}, 'cancel');
  }

  submitReport() {
    if (this.selectedCause) {
      console.log(`Reported post "${this.post.id}" for: ${this.selectedCause}`);
      let data = {
        report_type: this.selectedCause,
        content_type: 'post',
        content_id: this.post.id,
      };
      this.postsService.report(data).subscribe(
        (res) => {
          this.modalController.dismiss();
        },
        (erreur: any) => {
          this.apiService.displayMessage(
            erreur.error.error,
            'danger',
            'warning-outline'
          );
        }
      );
    } else {
      this.displayMessage('Please choose a Cause!', 'danger', 'danger');
    }
  }

  async displayMessage(content: string, color: string, icon: string) {
    const toast = await this.toastController.create({
      message: content,
      duration: 2000,
      position: 'bottom',
      color: color, //danger, dark, light, warning, ...
      icon: icon,
    });

    await toast.present();
  }
}
