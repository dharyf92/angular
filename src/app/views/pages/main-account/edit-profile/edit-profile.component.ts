import { Component, inject, OnInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { AuthActions } from '@core/stores/auth/auth.actions';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import { ModalController } from '@ionic/angular';
import { LocationsComponent } from '@modals/locations/locations.component';
import { Store } from '@ngxs/store';
import { CroperComponent } from '@shared/components/croper/croper.component';
import { ApiService } from '@shared/services/api/api.service';
import { CompletionService } from '@shared/services/completion/completion.service';
import { MediaService } from '@shared/services/media/media.service';
import { trim } from 'radash';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly mediaService = inject(MediaService);

  constructor(
    private modalController: ModalController,
    private completionService: CompletionService,
    private apiService: ApiService
  ) {}

  imageUrl = '';
  user = this.store.selectSnapshot(AuthSelectors.getUser);
  blob;

  ngOnInit() {
    console.log('user', this.user);
    if (this.user.avatar) {
      this.imageUrl = this.user.avatar.url;
    }
  }

  // Fonction pour prendre une photo
  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 100,
      width: 500,
      allowEditing: false,
      resultType: CameraResultType.Base64,
    });

    const modal = await this.modalController.create({
      component: CroperComponent,
      componentProps: {
        image: 'data:image/jpeg;base64,' + image.base64String, // Passer l'image à la modal pour le rognage
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.role === 'cancel') {
        // Si l'utilisateur annule, ne rien faire
      } else {
        // Si l'utilisateur confirme, récupérer l'image et la convertir en blob
        this.imageUrl = result.data.image;
        const contentType = 'image/png';
        let im = this.imageUrl.replace('data:image/png;base64,', '');
        const blob = this.mediaService.base64ToBlob(im, contentType);
        this.blob = blob;
      }
    });
    await modal.present();
  }

  closePopUp() {
    this.modalController.dismiss({}, 'cancel'); // Fermer la pop-up sans aucune action
  }

  done() {
    const formData = new FormData(); // Initialisation du FormData pour l'upload

    // Si l'utilisateur a modifié son avatar, l'ajouter à formData
    if (this.blob) {
      console.log('Avatar ajouté.');
      formData.append('avatar', this.blob);
    }

    // Séparer l'adresse en ville et pays si nécessaire
    const split = this.user.address?.split(',') || [];
    const country = split.length > 1 ? trim(split[split.length - 1]) : trim(this.user.address);
    const city = split.length > 1 ? trim(split[0]) : null;

    // Préparer les données du profil
    const data = {
      email: this.user.email,
      username: this.user.username,
      full_name: this.user.full_name,
      phone_number: this.user.phone_number,
      address: this.user.address,
      country,
      city,
      bio: this.user.bio,
      gender: this.user.gender,
      birthday: this.user.birthday ? new Date(this.user.birthday).toISOString() : null,
      account_type: this.user.account_type,
    };

    // Ajouter les données sous forme de chaîne JSON dans formData
    formData.append('data', JSON.stringify(data));

    // Appeler le service pour mettre à jour les informations de l'utilisateur
    this.completionService.complete(formData).subscribe(
      (res) => {
        // Sauvegarder les nouvelles informations de l'utilisateur dans le store
        this.store.dispatch(new AuthActions.SaveUser(res)).subscribe(() => {
          const user = this.store.selectSnapshot(AuthSelectors.getUser);

          if (user) {
            this.user = user;
            // Fermer la modal et retourner les résultats
            this.modalController.dismiss({ res: res });
          }
        });
      },
      (erreur: any) => {
        // Si une erreur se produit, afficher un message d'erreur
        this.apiService.displayMessage(
          erreur.error.error,
          'danger',
          'warning-outline'
        );
      }
    );
  }

  // Fonction pour afficher une modal de sélection de lieu (adresse)
  async showLocation() {
    const modal = await this.modalController.create({
      component: LocationsComponent,
    });
    modal
      .onDidDismiss()
      .then(
        (result: { role: string; data: { theme: { place_name: string } } }) => {
          if (result.role !== 'cancel') {
            this.user.address = result.data.theme.place_name;
          }
        }
      );
    await modal.present();
  }
}
