import {
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { CreateContent, PostFile } from '@core/models/content.model';
import { Category, CreatePost, Post, SavedItem } from '@core/models/post.model';
import { Picker } from '@core/models/user.model';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import {
  AlertController,
  Gesture,
  GestureController,
  ModalController,
  PickerController,
  ToastController,
} from '@ionic/angular';
import { Store } from '@ngxs/store';
import { ApiService } from '@shared/services/api/api.service';
import { MediaService } from '@shared/services/media/media.service';
import { PostsService } from '@shared/services/posts/posts.service';
import { lastValueFrom } from 'rxjs';
import { ClipVideoRecorderComponent } from '../clip-video-recorder/clip-video-recorder.component';
import { ClipsVideoDetailsComponent } from '../clips-video-details/clips-video-details.component';
import { LocationsComponent } from '../locations/locations.component';
import { SavedComponent } from '../saved/saved.component';
import { ThemesComponent } from '../themes/themes.component';
import { UpdateImageComponent } from '../update-image/update-image.component';
import { UsersComponent } from '../users/users.component';

// ! TODO: Refactor this component, it's too big
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent {
  private readonly mediaService = inject(MediaService);
  private readonly store = inject(Store);
  halfWidth = 0;
  imageUrl = '';
  user = this.store.selectSignal(AuthSelectors.getUser);
  typeChoice = '';
  isSelected = false;
  image1;
  image2;
  image3;
  image4;
  themes: Category[] = [];
  theme;
  counties = [];
  location;
  public = 'public';
  text_content = '';
  swipeGesture!: Gesture;
  minDateTime: string;
  selectedDateTime;
  currentDateTime;

  imagetoShow = '';

  tags: Picker[] = [];
  colorpicked = '#ffffff';
  selectedType;

  content1 = '';
  content2 = '';
  content3 = '';
  content4 = '';

  id1 = '';
  id2 = '';
  id3 = '';
  id4 = '';

  selectedTime = '';
  oldname1 = '';
  oldname2 = '';
  oldname3 = '';
  oldname4 = '';

  blobImage1;
  blobImage2;
  blobImage3;
  blobImage4;
  @ViewChild('contentElement', { static: true, read: ElementRef })
  contentElement!: ElementRef;
  id;
  city;
  saveds = [];
  video: PostFile;

  selected = input<'img' | 'txt' | 'saved' | 'clips' | 'default'>('default');
  isUpdate = input<boolean>(false);
  post = input<Post>();

  @ViewChild('palette') public palette: ElementRef;
  public color;
  constructor(
    private gestureController: GestureController,
    private pickerController: PickerController,
    private toastController: ToastController,
    public alertController: AlertController,
    private apiService: ApiService,
    private postsService: PostsService,
    private router: Router,
    private modalController: ModalController
  ) {
    effect(() => {
      if (
        this.selected() === 'img' ||
        this.selected() === 'txt' ||
        this.selected() === 'saved'
      ) {
        this.choiceImg(this.selected());
      } else if (this.selected() === 'clips') {
        this.launchCamera();
      }

      if (this.post() && this.isUpdate()) {
        this.getting(this.post());
        console.log('my post to update', this.post());
      }
    });

    this.halfWidth = (window.screen.width - 50) / 2;
    this.currentDateTime = new Date();
    // this.selectedDateTime =  new Date();

    if (this.user().avatar) {
      this.imageUrl = this.user().avatar.url;
    }
  }

  ionViewWillEnter() {
    this.swipeGesture = this.gestureController.create({
      el: this.contentElement.nativeElement,
      gestureName: 'swipe',
      onEnd: (ev) => this.onSwipeEnd(ev),
    });
    this.swipeGesture.enable();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.halfWidth = (window.screen.width - 52) / 2;
  }

  changePublic() {
    if (this.public == 'public') {
      this.public = 'friends';
    } else {
      this.public = 'public';
    }
  }

  private onSwipeEnd(ev: any) {
    if (ev.velocityX > 0) {
      (this.selectedType = ''), (this.isSelected = false);
      this.image1 = '';
      this.image2 = '';
      this.image3 = '';
      this.image4 = '';
      this.content1 = '';
      this.content2 = '';
      this.content3 = '';
      this.content4 = '';
      this.id1 = '';
      this.id2 = '';
      this.id3 = '';
      this.id4 = '';
    }
  }

  getExperationDateFormat(date) {
    const inputString = date; // Example input

    // Regular expressions to match days, hours, and minutes
    const dayMatch = inputString.match(/\d+d/);
    const hourMatch = inputString.match(/\d+h/);
    const minMatch = inputString.match(/\d+min/);

    // Extract the values from matches or use 0 if not found
    const days = dayMatch ? parseInt(dayMatch[0]) : 0;
    const hours = hourMatch ? parseInt(hourMatch[0]) : 0;
    const minutes = minMatch ? parseInt(minMatch[0]) : 0;

    // Format the components
    const formattedDays = days.toString().padStart(2, '0');
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    // Create the formatted time string
    const formattedTimeString = `${formattedDays}d:${formattedHours}h:${formattedMinutes}m`;

    return formattedTimeString;
  }

  async getting(post: Post) {
    try {
      this.themes = await lastValueFrom(this.postsService.getThemes());
      this.selectedDateTime = post.expiration_date;
      this.tags = post.tagged_users?.map((item) => item) || [];
      this.id = post.id;
      this.text_content = post.text_content || '';
      this.theme = this.themes.find((item) => item.id === post.category_id);
      this.city = post.city;
      this.public = post.is_private ? 'friends' : 'public';
      this.location = {
        text: post.city,
        address: post.address,
        context: [{ id: 'country', text: post.country }],
      };

      if (post.post_contents.length > 0) {
        this.selectedType = 'img';
        this.isSelected = true;
        for (let i = 0; i < post.post_contents.length; i++) {
          const content = post.post_contents[i];
          if (content.image_path.url !== null && content.file_name !== '') {
            this[`image${i + 1}`] = content.image_path.url;
            this[`id${i + 1}`] = content.id;
            this[`oldname${i + 1}`] = content.file_name;
            this[`blobImage${i + 1}`] = await fetch(this[`image${i + 1}`]).then(
              (res) => res.blob()
            );
          }
        }
      }

      if (
        post.post_contents.length > 0 &&
        post.post_contents[0].question_text !== null
      ) {
        this.choiceImg('txt');
        for (let i = 0; i < post.post_contents.length; i++) {
          const content = post.post_contents[i];
          if (content.question_text !== null) {
            this[`content${i + 1}`] = content.question_text;
            this.colorpicked = content.question_color;
            this[`id${i + 1}`] = content.id;
          }
        }
      }
    } catch (error) {
      this.apiService.displayMessage(
        error.message,
        'danger',
        'warning-outline'
      );

      throw error;
    }
  }

  choiceImg(type) {
    this.isSelected = true;
    this.selectedType = type;
  }

  takePicture = async (num: number) => {
    if (this.selectedType === 'saved') {
      await this.getSavedThemes(num);
      return;
    }

    try {
      const image = await Camera.getPhoto({
        quality: 100,
        width: 500,
        allowEditing: false,
        resultType: CameraResultType.Base64,
      });

      if (image.base64String) {
        const imageData = `data:image/png;base64,${image.base64String}`;
        this.updateImageData(num, imageData);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      this.apiService.displayMessage(
        'Failed to capture image',
        'danger',
        'warning-outline'
      );
    }
  };

  private updateImageData(number: number, imageData: string) {
    const imageKey = `image${number}` as keyof PostComponent;
    const oldNameKey = `oldname${number}` as keyof PostComponent;

    (this[imageKey] as any) = imageData;

    if (this.isUpdate() && this.post()) {
      const postContents = this.post().post_contents;
      if (postContents && postContents.length >= number) {
        const content = postContents[number - 1];
        if (content && content.file_name) {
          (this[oldNameKey] as any) = content.file_name;
        }
      }
    }
  }

  async choiceLocation() {
    const modal = await this.modalController.create({
      component: LocationsComponent,
    });
    modal.onDidDismiss().then((result) => {
      if (result.role === 'cancel') {
        this.location = null;
      } else {
        console.log(result.data.theme);
        this.location = result.data.theme;
      }
    });
    await modal.present();
  }

  async choiceTheme() {
    this.postsService.getThemes().subscribe(
      async (res) => {
        this.themes = res;
        const modal = await this.modalController.create({
          component: ThemesComponent,
          componentProps: {
            themes: this.themes,
          },
        });
        modal.onDidDismiss().then((result) => {
          if (result.role === 'cancel') {
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

  closeModalWithoutThem() {
    this.modalController.dismiss('cancel');
  }

  async postPick() {
    this.postsService.isPosting.set(true);
    this.postsService.isLoading = false;

    if (!this.isUpdate() && !this.validatePost()) {
      return;
    }

    const post = this.createPostObject();
    const postContents = this.createPostContents();

    const formData = new FormData();
    if (this.selectedType === 'img') {
      this.appendFilesToFormData(formData);
    }

    formData.append('post', JSON.stringify({ ...post }));
    if (postContents.length > 0) {
      formData.append('contents', JSON.stringify([...postContents]));
    }

    try {
      if (this.isUpdate()) {
        await this.updatePost(formData);
      } else {
        await this.createNewPost(formData);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  private createPostObject(): Partial<CreatePost> {
    const country = this.location?.context?.find((item: { id: string }) =>
      item.id.toLowerCase().includes('country')
    );
    console.log(country);

    return {
      is_private: this.public !== 'public',
      category_id: this.theme.id,
      text_content: this.text_content || null,
      city: this.location?.text || null,
      country: country?.text || null,
      address: this.location?.address || null,
      expiration_date: this.selectedDateTime
        ? this.formatExpirationDate(this.selectedDateTime)
        : null,
      is_clip: this.selectedType === 'clips',
      users_tag: this.tags ? this.tags.map((item) => item.id) : [],
    };
  }

  private createPostContents(): Partial<CreateContent>[] {
    let contents: Partial<CreateContent>[] = [];

    if (this.selectedType === 'txt') {
      contents = this.createTextContents();
    }
    if (this.selectedType === 'saved') {
      contents = this.createSavedContents();
    }
    return contents;
  }

  private createTextContents(): Partial<CreateContent>[] {
    return [this.content1, this.content2, this.content3, this.content4]
      .filter((content) => content)
      .map((content) => ({
        question_text: content,
        question_color: this.colorpicked,
      }));
  }

  private formatExpirationDate(date: string): string {
    if (date.includes(':')) {
      return date;
    }
    return this.isWithinTimeRange(date);
  }

  private validatePost(): boolean {
    if (!this.theme) {
      this.apiService.displayMessage(
        'Please choose a theme!',
        'danger',
        'warning-outline'
      );
      return false;
    }
    if (!this.location) {
      this.apiService.displayMessage(
        'Please choose a location!',
        'danger',
        'warning-outline'
      );
      return false;
    }
    if (
      !this.image1 &&
      !this.content1 &&
      !this.content2 &&
      !this.content3 &&
      !this.content4 &&
      !this.video
    ) {
      this.apiService.displayMessage(
        'Please enter at least one pick option!',
        'danger',
        'warning-outline'
      );
      return false;
    }
    return true;
  }

  private appendFilesToFormData(formData: FormData) {
    const contentType = 'image/png';
    [this.image1, this.image2, this.image3, this.image4].forEach(
      (image, index) => {
        if (image) {
          const blob = image.includes('base64')
            ? this.base64ToBlob(image, contentType)
            : this[`blobImage${index + 1}`];
          formData.append('files', blob, this[`oldname${index + 1}`]);
        }
      }
    );
  }

  private async updatePost(formData: FormData) {
    this.postsService.update$$.subscribe(() => {
      this.modalController.dismiss(null, 'done');
    });

    this.postsService.update$$.next({ id: this.id, data: formData });
  }

  private async createNewPost(formData: FormData) {
    this.postsService.add$$.subscribe(() => {
      this.postsService.menuPageTop.scrollToTop(700);
      this.router.navigate(['/main-tabs/main-picks']);
      this.apiService.selectedTab = 'main-picks';
      this.modalController.dismiss(null, 'done');
    });

    this.postsService.add$$.next(formData);
  }

  private handleError(error: any) {
    this.apiService.displayMessage(
      error.error.error,
      'danger',
      'warning-outline'
    );
  }

  async displayMessage(content: string, color: string, icon: string) {
    const toast = await this.toastController.create({
      message: content,
      duration: 2000,
      position: 'bottom',
      color: color,
      icon: icon,
    });

    await toast.present();
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

  async openTimePicker() {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();

    const picker = await this.pickerController.create({
      mode: 'ios', // Set the mode to iOS style
      cssClass: 'time-picker',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Set',
          handler: (value: any) => {
            let selectedDay = value['days'].value;
            let selectedHour = value['hours'].value;
            let selectedMinute = value['minutes'].value;

            const selectedDate = new Date();
            selectedDate.setDate(selectedDate.getDate() + selectedDay);
            selectedDate.setHours(selectedHour);
            selectedDate.setMinutes(selectedMinute);

            selectedDay = selectedDay < 10 ? '0' + selectedDay : selectedDay;
            selectedHour =
              selectedHour < 10 ? '0' + selectedHour : selectedHour;
            selectedMinute =
              selectedMinute < 10 ? '0' + selectedMinute : selectedMinute;

            this.selectedDateTime =
              selectedDay + ':' + selectedHour + ':' + selectedMinute + ':00';
          },
        },
      ],
      columns: [
        {
          name: 'days',
          options: this.generateOptions(31), // You can adjust this based on your requirement
          selectedIndex: 0, // Set default index
          prefix: 'day',
        },
        {
          name: 'hours',
          options: this.generateOptions(24),
          selectedIndex: currentHour, // Set default index
          prefix: 'hour',
        },
        {
          name: 'minutes',
          options: this.generateOptions(60),
          selectedIndex: currentMinute, // Set default index
          prefix: 'minute',
        },
      ],
    });

    await picker.present();
  }

  isWithinTimeRange(expirationDate: string): any {
    let arry = expirationDate.split(' ');

    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (
      arry.length == 3 &&
      expirationDate.includes('d') &&
      expirationDate.includes('h') &&
      expirationDate.includes('min')
    ) {
      days = parseInt(arry[0]);
      hours = parseInt(arry[1]);
      minutes = parseInt(arry[2]);
    }
    if (
      arry.length == 2 &&
      expirationDate.includes('d') &&
      expirationDate.includes('h')
    ) {
      days = parseInt(arry[0]);
      hours = parseInt(arry[1]);
    }
    if (
      arry.length == 2 &&
      expirationDate.includes('d') &&
      expirationDate.includes('min')
    ) {
      days = parseInt(arry[0]);
      minutes = parseInt(arry[1]);
    }

    if (
      arry.length == 2 &&
      expirationDate.includes('h') &&
      expirationDate.includes('min')
    ) {
      hours = parseInt(arry[0]);
      minutes = parseInt(arry[1]);
    }
    if (arry.length == 1 && expirationDate.includes('h')) {
      hours = parseInt(arry[0]);
    }
    if (arry.length == 1 && expirationDate.includes('d')) {
      days = parseInt(arry[0]);
    }
    if (arry.length == 1 && expirationDate.includes('min')) {
      minutes = parseInt(arry[0]);
    }

    let days2 = days > 10 ? days : '0' + days;
    let hours2 = hours > 10 ? hours : '0' + hours;
    let minutes2 = minutes > 10 ? minutes : '0' + minutes;

    return `${days2}:${hours2}:${minutes2}:00`;
  }

  generateOptions(maxValue: number) {
    const options = [];
    for (let i = 0; i < maxValue; i++) {
      options.push({ text: this.formatValue(i), value: i });
    }
    return options;
  }

  formatValue(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }

  async chooseUser() {
    const modal = await this.modalController.create({
      component: UsersComponent,
    });

    await modal.present();

    const { role, data } = await modal.onDidDismiss<{
      picker: Picker;
    }>();

    if (role === 'done') {
      let index = this.tags.findIndex((item) => item.id === data.picker.id);
      if (index >= 0) {
        this.apiService.displayMessage(
          'user has been selected befor',
          'danger',
          'warning-outline'
        );
      } else {
        this.tags.push(data.picker);
      }
    }
  }

  deleteItem(tag) {
    this.tags = this.tags.filter((item) => item.id != tag.id);
  }

  async openActionSheet(index: number) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-alert',
      inputs: [
        {
          name: 'text',
          type: 'textarea',
          placeholder: 'Add choice ' + index + ' to your post…',
          cssClass: 'my-custom-class',
        },
      ],
      buttons: [
        {
          text: '0/500',
          cssClass: 'my-custom-button-alert',
          handler: () => {
            console.log('Saved:');
          },
        },
        {
          text: '',
          cssClass: 'my-custom-button-alert-close',
          handler: () => {
            console.log('Saved:');
          },
        },
        {
          text: 'Save',
          cssClass: 'my-custom-button-alert-save',
          handler: (data) => {
            // Handle save button click
            // Access the entered text using data.text
            if (index == 1) {
              this.content1 = data.text;
            } else if (index == 2) {
              this.content2 = data.text;
            } else if (index == 3) {
              this.content3 = data.text;
            } else if (index == 4) {
              this.content4 = data.text;
            }
          },
        },
      ],
    });

    // Set up a function to update the character count dynamically
    const updateCharacterCount = () => {
      const inputElement = alert.querySelector(
        '.my-custom-class'
      ) as HTMLTextAreaElement;
      const characterCount = inputElement.value.length;
      const saveButton = alert.querySelector(
        '.my-custom-button-alert'
      ) as HTMLElement;
      const Button2 = alert.querySelector(
        '.my-custom-button-alert-save'
      ) as HTMLElement;

      saveButton.innerText = `${characterCount}/500`;

      if (characterCount > 500) {
        Button2.setAttribute('disabled', 'true');
        saveButton.style.color = 'red';
      } else {
        // Reset the color of the button text
        saveButton.style.color = '';
        Button2.removeAttribute('disabled');
      }
    };

    // Attach the updateCharacterCount function to the input event
    alert.addEventListener('input', updateCharacterCount);

    await alert.present();
  }

  getColorByBgColor(hexColor: string) {
    if (!hexColor) {
      return '#000';
    }
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    let luminance = (r * 299 + g * 587 + b * 114) / 1000;
    return luminance >= 128 ? '#000' : '#fff';
  }

  async openModalPintura(image, name) {
    const modal = await this.modalController.create({
      component: UpdateImageComponent,
      // Optional: Pass data to the modal

      componentProps: {
        image: image,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.role === 'cancel') {
      } else {
        if (name == 'img1') {
          this.image1 = result.data.image;
        }
        if (name == 'img2') {
          this.image2 = result.data.image;
        }
        if (name == 'img3') {
          this.image3 = result.data.image;
        }
        if (name == 'img4') {
          this.image4 = result.data.image;
        }
      }
    });
    await modal.present();
  }

  launchCamera = async () => {
    const modal = await this.modalController.create({
      component: ClipVideoRecorderComponent,
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss<{
      path: string;
      name: string;
      thumbnail: string;
    }>();

    console.log({ data });

    if (role === 'done') {
      this.clipsVideoOptions(data);
    }
  };

  async clipsVideoOptions(data: {
    path: string;
    name: string;
    thumbnail: string;
  }) {
    const blob = await this.mediaService.getFileAsBlob(data.path);

    const modal = await this.modalController.create({
      component: ClipsVideoDetailsComponent,
      componentProps: {
        thumbnail: data.thumbnail,
        blob,
        fileName: data.name,
      },
    });

    await modal.present();

    modal.onDidDismiss().then(async (result) => {
      if (result.role === 'done') {
        await this.modalController.dismiss(undefined, 'done');
        this.router.navigate(['/main-tabs/main-clips']);
        this.apiService.selectedTab = 'main-clips';
      }
    });
  }

  savedContents: Array<SavedItem> = [];

  private createSavedContents(): Partial<CreateContent>[] {
    return this.savedContents.slice(0, 4).flatMap((savedItem) =>
      savedItem.saved_link.map((content) => ({
        link_url: content.image_url,
        image_url: content.image_url,
        provider: 'saved',
        link_metadata: { savedId: savedItem.id },
        category_id: this.theme?.id,
      }))
    );
  }

  // Mettez à jour la méthode getSavedThemes
  async getSavedThemes(number: number) {
    const modal = await this.modalController.create({
      component: SavedComponent,
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss<{
      item: SavedItem;
    }>();

    if (role !== 'cancel' && data?.item) {
      const index = number - 1;
      if (index >= 0 && index < 4) {
        this.savedContents[index] = data.item;

        // Mise à jour de l'image correspondante
        this[`image${number}`] = data.item.saved_link[0].image_url;
      }
    }
  }
}
