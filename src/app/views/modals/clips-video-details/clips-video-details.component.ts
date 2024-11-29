import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { Content } from '@core/models/content.model';
import { Category, CreatePost, Post } from '@core/models/post.model';
import { Picker } from '@core/models/user.model';
import {
  AlertController,
  Gesture,
  GestureController,
  ModalController,
  PickerController,
  ToastController,
} from '@ionic/angular';
import { ApiService } from '@shared/services/api/api.service';
import { AppService } from '@shared/services/app/app.service';
import { ClipsService } from '@shared/services/clips/clips.service';
import { MediaService } from '@shared/services/media/media.service';
import { PostsService } from '@shared/services/posts/posts.service';
import { trim } from 'radash';
import { lastValueFrom } from 'rxjs';
import { LocationsComponent } from '../locations/locations.component';
import { ThemesComponent } from '../themes/themes.component';
import { UpdateImageComponent } from '../update-image/update-image.component';
import { UsersComponent } from '../users/users.component';

type Choice = 'img' | 'txt' | 'saved' | undefined;

interface ImageData {
  image: string;
  content: string;
  id: string;
  oldname: string;
  blobImage?: Blob;
}

@Component({
  selector: 'app-clips-video-details',
  templateUrl: './clips-video-details.component.html',
  styleUrls: ['./clips-video-details.component.scss'],
})
export class ClipsVideoDetailsComponent {
  private readonly mediaService = inject(MediaService);
  private readonly appService = inject(AppService);
  private readonly isBetweenRange = this.appService.checkExpirationDateRange;
  private readonly getContentType = this.appService.identifyPostType;

  @ViewChild('contentElement', { static: true, read: ElementRef })
  contentElement!: ElementRef;
  @ViewChild('palette') public palette: ElementRef;

  public imageData: ImageData[] = Array(4)
    .fill({})
    .map(() => ({ image: '', content: '', id: '', oldname: '' }));
  public themes: Category[] = [];
  public theme: Category;
  public location: any;
  public public = 'public';
  public text_content = '';
  public tags: Picker[] = [];
  public colorpicked = '#ffffff';
  public selectedType = signal<Choice>(undefined);
  public selectedDateTime: string;
  public id: string;
  public city: string;
  public color: string;

  public blob = input.required<Blob>();
  public thumbnail = input.required<string>();
  fileName = input.required<string>();
  public post = input<Post | null>(null);
  public isUpdate = input<boolean>(false);
  public video: { name: string };
  private swipeGesture!: Gesture;

  isPosting = computed(() => this.postsService.isPosting());

  constructor(
    private gestureController: GestureController,
    private pickerController: PickerController,
    private toastController: ToastController,
    public alertController: AlertController,
    private apiService: ApiService,
    private postsService: PostsService,
    private modalController: ModalController,
    private readonly clipsService: ClipsService
  ) {
    this.initializeComponent();
  }

  private initializeComponent(): void {
    if (this.post() && this.isUpdate()) {
      this.getting(this.post());
    }
  }

  ionViewWillEnter(): void {
    this.setupSwipeGesture();
  }

  private setupSwipeGesture(): void {
    this.swipeGesture = this.gestureController.create({
      el: this.contentElement.nativeElement,
      gestureName: 'swipe',
      onEnd: (ev) => this.onSwipeEnd(ev),
    });
    this.swipeGesture.enable();
  }

  changePublic(): void {
    this.public = this.public === 'public' ? 'friends' : 'public';
  }

  private onSwipeEnd(ev: any): void {
    if (ev.velocityX > 0) {
      this.resetData();
    }
  }

  private resetData(): void {
    this.selectedType.set(undefined);
    this.imageData = this.imageData.map(() => ({
      image: '',
      content: '',
      id: '',
      oldname: '',
    }));
  }

  choiceImg(type: Choice): void {
    this.selectedType.set(type);
  }

  takePicture = async (index: number): Promise<void> => {
    const image = await this.mediaService.takePicture();
    this.imageData[index].image = `data:image/png;base64,${image.base64String}`;
  };

  async choiceLocation(): Promise<void> {
    const modal = await this.modalController.create({
      component: LocationsComponent,
    });
    modal.onDidDismiss().then((result) => {
      this.location = result.role === 'cancel' ? null : result.data.theme;
    });
    await modal.present();
  }

  async choiceTheme(): Promise<void> {
    try {
      this.themes = await lastValueFrom(this.postsService.getThemes());
      const modal = await this.modalController.create({
        component: ThemesComponent,
        componentProps: { themes: this.themes },
      });
      modal.onDidDismiss().then((result) => {
        this.theme = result.role === 'cancel' ? null : result.data.theme;
      });
      await modal.present();
    } catch (error) {
      this.apiService.displayMessage(
        error.error.error,
        'danger',
        'warning-outline'
      );
    }
  }

  closeModalWithoutThem(): void {
    if (this.postsService.isPosting()) return;

    this.modalController.dismiss({}, 'cancel');
  }

  async postPick(): Promise<void> {
    try {
      this.postsService.isPosting.set(true);

      this.apiService.showLoading('Posting your pick...', 1500000);

      if (!this.validateClipPost()) {
        throw new Error('Invalid post');
      }

      const post = this.createClipPostObject();
      const questions = this.createClipQuestions();
      const formData = this.createFormData(post, questions);

      const result = this.isUpdate()
        ? await this.updateClipPost(formData)
        : await this.createNewClipPost(formData);

      this.apiService.displayMessage(
        'Your pick has been posted!',
        'success',
        'checkmark-circle-outline'
      );

      this.modalController.dismiss(result, 'done');
    } catch (error) {
      this.handleError(error);
      this.apiService.dismissLoading();
    }
  }

  private formatExpirationDate(date: string): string {
    const [days, hours, minutes] = date
      .split(' ')
      .map((part) => part.replace(/\D/g, '').padStart(2, '0'));
    return `${days}:${hours}:${minutes}:00`;
  }

  private handleError(error: any): void {
    this.apiService.displayMessage(
      error.error.error,
      'danger',
      'warning-outline'
    );
  }

  private validateClipPost(): boolean {
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
    if (!this.imageData[0].image && !this.imageData[0].content) {
      this.apiService.displayMessage(
        'Please enter at least one pick option!',
        'danger',
        'warning-outline'
      );
      return false;
    }

    if (!this.blob() && !this.video) {
      this.apiService.displayMessage(
        'Please create a video or choose a clip!',
        'danger',
        'warning-outline'
      );
      return false;
    }

    return true;
  }

  private createClipPostObject(): Partial<CreatePost> {
    const split = this.location?.text.split(',');
    const country =
      split.length > 1
        ? trim(split[split.length - 1])
        : trim(this.location.address);
    const city = split.length > 1 ? trim(split[0]) : null;
    return {
      is_private: this.public !== 'public',
      category_id: this.theme.id,
      text_content: this.text_content || null,
      city,
      country,
      expiration_date: this.selectedDateTime
        ? this.formatExpirationDate(this.selectedDateTime)
        : null,
      is_clip: true,
      users_tag: this.tags.map((item) => item.id),
    };
  }

  private createClipQuestions(): Partial<Content>[] {
    return this.imageData
      .map(({ content }) =>
        content
          ? { question_text: content, question_color: this.colorpicked }
          : null
      )
      .filter(Boolean);
  }

  private createFormData(
    post: Partial<CreatePost>,
    questions: Partial<Content>[]
  ): FormData {
    const formData = new FormData();
    this.appendClipFilesToFormData(formData);
    formData.append('post', JSON.stringify(post));
    if (questions.length > 0) {
      formData.append('contents', JSON.stringify(questions));
    }
    return formData;
  }

  private appendClipFilesToFormData(formData: FormData): void {
    this.imageData.forEach(({ image, blobImage, oldname }, index) => {
      if (image) {
        const blob = image.includes('base64')
          ? this.base64ToBlob(image, 'image/png')
          : blobImage;
        formData.append('files', blob, oldname);
      }
    });

    formData.append('files', this.blob(), this.fileName());
  }

  private async updateClipPost(formData: FormData): Promise<any> {
    return await lastValueFrom(this.clipsService.update(this.id, formData));
  }

  private async createNewClipPost(formData: FormData): Promise<any> {
    return await lastValueFrom(this.clipsService.add(formData));
  }

  async displayMessage(
    content: string,
    color: string,
    icon: string
  ): Promise<void> {
    const toast = await this.toastController.create({
      message: content,
      duration: 2000,
      position: 'bottom',
      color: color,
      icon: icon,
    });
    await toast.present();
  }

  private base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64.replace('data:image/png;base64,', ''));
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

  async openTimePicker(): Promise<void> {
    const currentDate = new Date();
    const picker = await this.pickerController.create({
      mode: 'ios',
      cssClass: 'time-picker',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Set',
          handler: (value: any) => {
            this.selectedDateTime = this.formatSelectedDateTime(value);
          },
        },
      ],
      columns: this.createTimePickerColumns(currentDate),
    });
    await picker.present();
  }

  resetImage(index: number): void {
    this.imageData[index].image = '';
  }

  resetContent(index: number): void {
    this.imageData[index].content = '';
  }

  private formatSelectedDateTime(value: any): string {
    const { days, hours, minutes } = value;
    return `${this.formatValue(days.value)}:${this.formatValue(
      hours.value
    )}:${this.formatValue(minutes.value)}:00`;
  }

  private createTimePickerColumns(currentDate: Date): any[] {
    return [
      {
        name: 'days',
        options: this.generateOptions(31),
        selectedIndex: 0,
        prefix: 'day',
      },
      {
        name: 'hours',
        options: this.generateOptions(24),
        selectedIndex: currentDate.getHours(),
        prefix: 'hour',
      },
      {
        name: 'minutes',
        options: this.generateOptions(60),
        selectedIndex: currentDate.getMinutes(),
        prefix: 'minute',
      },
    ];
  }

  isWithinTimeRange(expirationDate: string) {
    return this.isBetweenRange(expirationDate);
  }

  identifyPostType(post: Post): string {
    return this.getContentType(post.post_contents);
  }

  private generateOptions(maxValue: number): { text: string; value: number }[] {
    return Array.from({ length: maxValue }, (_, i) => ({
      text: this.formatValue(i),
      value: i,
    }));
  }

  private formatValue(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }

  async chooseUser(): Promise<void> {
    const modal = await this.modalController.create({
      component: UsersComponent,
    });
    modal.onDidDismiss().then((result) => {
      if (result.role !== 'cancel') {
        this.addUserTag(result.data.theme);
      }
    });
    await modal.present();
  }

  private addUserTag(user: any): void {
    if (!this.tags.some((item) => item.id === user.id)) {
      this.tags.push(user);
    } else {
      this.apiService.displayMessage(
        'User has been selected before',
        'danger',
        'warning-outline'
      );
    }
  }

  deleteItem(tag: any): void {
    this.tags = this.tags.filter((item) => item.id !== tag.id);
  }

  async openActionSheet(index: number, content?: string): Promise<void> {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-alert',
      inputs: [
        {
          name: 'text',
          type: 'textarea',
          value: content,
          placeholder: `Add choice ${index} to your post…`,
          cssClass: 'my-custom-class',
        },
      ],
      buttons: this.createActionSheetButtons(index),
    });

    this.setupCharacterCountUpdate(alert);

    await alert.present();
  }

  private createActionSheetButtons(index: number): any[] {
    return [
      {
        text: '0/500',
        cssClass: 'my-custom-button-alert',
        handler: () => console.log('Saved:'),
      },
      {
        text: '',
        cssClass: 'my-custom-button-alert-close',
        handler: () => console.log('Saved:'),
      },
      {
        text: 'Save',
        cssClass: 'my-custom-button-alert-save',
        handler: (data) => {
          this.imageData[index - 1].content = data.text;
        },
      },
    ];
  }

  private setupCharacterCountUpdate(alert: HTMLIonAlertElement): void {
    const updateCharacterCount = () => {
      const inputElement = alert.querySelector(
        '.my-custom-class'
      ) as HTMLTextAreaElement;
      const characterCount = inputElement.value.length;
      const saveButton = alert.querySelector(
        '.my-custom-button-alert'
      ) as HTMLElement;
      const button2 = alert.querySelector(
        '.my-custom-button-alert-save'
      ) as HTMLElement;

      saveButton.innerText = `${characterCount}/500`;

      if (characterCount > 500) {
        button2.setAttribute('disabled', 'true');
        saveButton.style.color = 'red';
      } else {
        saveButton.style.color = '';
        button2.removeAttribute('disabled');
      }
    };

    alert.addEventListener('input', updateCharacterCount);
  }

  async openModalPintura(image: string, name: string): Promise<void> {
    const modal = await this.modalController.create({
      component: UpdateImageComponent,
      componentProps: { image },
    });

    modal.onDidDismiss().then((result) => {
      if (result.role !== 'cancel') {
        const index = parseInt(name.replace('img', '')) - 1;
        this.imageData[index].image = result.data.image;
      }
    });
    await modal.present();
  }

  async getting(post: Post): Promise<void> {
    this.city = post.city;
    this.selectedDateTime = post.expiration_date;
    this.tags = post.tagged_users;
    this.id = post.id;
    this.text_content = post.text_content;
    this.theme = this.themes?.find((item) => item.id === post.category_id);
    await this.handlePostContents(post.post_contents);
  }

  private async handlePostContents(
    postContents: Array<Content>
  ): Promise<void> {
    const files = postContents.filter((item) => item.image_path);
    const video = postContents.find((item) => item.video_path);
    if (video?.file_name) {
      this.video = { name: video.file_name };
    }
    await this.handleFiles(files);
    this.handleQuestions(postContents);
  }

  private async handleFiles(files: Array<Content>): Promise<void> {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.image_path) {
        this.choiceImg('img');
        this.imageData[i] = {
          image: file.image_path.url,
          content: '',
          id: file.id,
          oldname: file.file_name,
          blobImage: await fetch(file.image_path.url).then((res) => res.blob()),
        };
      }
    }
  }

  private handleQuestions(postContents: Array<Content>): void {
    postContents.forEach((question, i) => {
      if (question.question_text) {
        this.choiceImg('txt');
        this.imageData[i].content = question.question_text;
        this.colorpicked = question.question_color;
        this.imageData[i].id = question.id;
      }
    });
  }
}
