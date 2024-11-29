import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Interest } from '@core/models/user.model';
import {
  IonRouterOutlet,
  ModalController,
  PickerController,
  Platform,
} from '@ionic/angular';
import { CroperComponent } from '@shared/components/croper/croper.component';
import { ApiService } from '@shared/services/api/api.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { CompletionService } from '@shared/services/completion/completion.service';
import { Subscription } from 'rxjs';
import { z } from 'zod';

import { Location } from '@angular/common';
import { AuthActions } from '@core/stores/auth/auth.actions';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import { Store } from '@ngxs/store';
import { FirebaseAuthenticationService } from '@shared/services/firebase-authentication/firebase-authentication.service';
import { MediaService } from '@shared/services/media/media.service';
import { differenceInYears } from 'date-fns';
import { isObject, sort } from 'radash';

const signupUserSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .optional(),
  full_name: z.string().optional(),
});

type InterestWithSelected = Interest & { isSelected: boolean; order?: number };

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.page.html',
  styleUrls: ['./complete-profile.page.scss'],
})
export class CompleteProfilePage implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly store = inject(Store);
  private readonly mediaService = inject(MediaService);
  private readonly location = inject(Location);
  private readonly firebaseAuthenticationService = inject(
    FirebaseAuthenticationService
  );

  isVisible = signal(false);

  day = 'DD';
  month = 'MM';
  year = 'YYYY';
  progress = 0.14;
  step = signal(0);
  selection = 0;
  isUpdate = false;
  interests: InterestWithSelected[] = [];
  sub!: Subscription;
  user = this.authService.userBuilder;

  onUserFullNameChange(event) {
    console.log(event);

    this.user.setFullName(event.target.value);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.routerOutlet.swipeGesture = false;
  }

  getFile = (file: Blob | string): string => {
    if (typeof file === 'string') {
      return file;
    }
    return URL.createObjectURL(file);
  };

  ngOnInit(): void {
    if (this.authService.googleUser) {
      this.user
        .setEmail(this.authService.googleUser.email)
        .setFullName(this.authService.googleUser.displayName)
        .setAvatar(this.authService.googleUser.imageUrl);
    }
    this.updateBirthdayFields();
    this.updateProgressAndStep();
    this.fetchAndProcessInterests();

    const signupUserSchemaSafeParse = signupUserSchema.safeParse(this.user);
    if (signupUserSchemaSafeParse.error) {
      this.router.navigate(['/sign-up']);
      return;
    }
  }

  ionViewWillEnter() {
    this.routerOutlet.swipeGesture = false;

    this.sub = this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.step() > 1) {
        this.step.update((value) => value - 1);
        return;
      }
      this.step.set(1);
      this.location.back();
    });
  }

  togglePassword() {
    this.isVisible.update((value) => !value);
  }

  ionViewDidLeave() {
    this.sub.unsubscribe();
  }

  private updateBirthdayFields() {
    if (this.user.birthday) {
      const birthday = new Date(this.user.birthday);
      this.day = birthday.getDay().toString();
      this.month = birthday.toLocaleString('en-EN', { month: 'long' });
      this.year = birthday.getFullYear().toString();
    }
  }

  private updateProgressAndStep() {
    const steps = [
      { condition: !this.user.username, step: 1, progress: 0 },
      { condition: !this.user.full_name, step: 2, progress: 0.17 },
      { condition: !this.user.gender, step: 3, progress: 0.17 * 2 },
      { condition: !this.user.birthday, step: 4, progress: 0.17 * 3 },
      { condition: !this.user.avatar, step: 5, progress: 0.17 * 4 },
      { condition: !this.user.bio, step: 6, progress: 0.17 * 6 },
      { condition: !this.user.interests, step: 7, progress: 0.17 * 7 },
    ];

    for (const stepInfo of steps) {
      if (stepInfo.condition) {
        this.step.set(stepInfo.step);
        this.progress = stepInfo.progress;
        return;
      }
    }
  }

  private fetchAndProcessInterests() {
    this.completionService.getInterests().subscribe(
      (res) => {
        this.interests = res.map((obj) => ({
          name: this.capitalizeFirstLetter(obj.name),
          isSelected: false,
          order: 0,
          ...obj,
        }));

        this.interests.forEach((item) => {
          item.isSelected = this.user.interests?.includes(item.id);
        });
      },
      (error: any) => {
        console.log(error);

        this.apiService.displayMessage(
          error.error.error,
          'danger',
          'warning-outline'
        );
      }
    );
  }

  public pickerButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Confirm',
      handler: (value) => {
        window.alert(`You selected: ${value.languages.value}`);
      },
    },
  ];
  constructor(
    public pickerCtrl: PickerController,
    private apiService: ApiService,
    private completionService: CompletionService,
    private modalController: ModalController,
    private router: Router,
    private readonly platform: Platform,
    private readonly routerOutlet: IonRouterOutlet
  ) {}

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  reset() {
    const selectedInterests = this.interests.filter(
      (interest) => interest.isSelected
    );
    selectedInterests.forEach((interest, index) => {
      interest.order = index + 1;
    });
  }

  selectChip(interest: InterestWithSelected) {
    if (interest.isSelected) {
      this.selection -= 1;
      interest.isSelected = !interest.isSelected;
      this.reset();
    } else {
      if (this.selection > 3) {
        this.apiService.displayMessage(
          "You can't select more than 4 interests!",
          'danger',
          'warning-outline'
        );
        return;
      }
      interest.isSelected = true;
      this.selection += 1;
      interest.order = this.selection;
    }
  }

  removeProgress() {
    this.progress -= 0.17;
    if (this.step() > 1) {
      this.step.update((value) => value - 1);
    }
  }

  addProgress() {
    console.log(this.user);

    const step = this.step();
    const validationMessages = {
      1: {
        message: 'Please provide a valid pseudo!',
        condition: () => !this.user.username,
      },
      2: {
        message: 'Please provide a valid full name!',
        condition: () => !this.user.full_name,
      },
      3: {
        message: 'Please select one of the options!',
        condition: () => !this.user.gender,
      },
      4: {
        message: 'Please select your date of birth!',
        condition: () => !this.user.birthday,
      },
    };

    if (step < 5 && !this.user[Object.keys(validationMessages)[step]]) {
      if (validationMessages[step].condition()) {
        this.apiService.displayMessage(
          validationMessages[step],
          'danger',
          'warning-outline'
        );
        return;
      }
    }

    if (step === 5) {
      console.log(
        this.isUpdate ? 'is update is true' : 'skipped to next in picture take!'
      );
    }

    if (step === 6) {
      console.log(this.user);
    }

    this.nextStep();
  }

  nextStep() {
    this.progress += 0.17;
    if (this.step() < 7) {
      this.step.update((value) => value + 1);
    }
  }

  async complete() {
    if (this.selection < 2) {
      this.apiService.displayMessage(
        'You need to select at least 2 interests!',
        'danger',
        'warning-outline'
      );
      return;
    }

    this.apiService.showLoading('Loading...');

    const interests = this.interests
      .filter((item) => item.isSelected)
      .map((item) => item.id);

    this.user.setInterests(interests);

    console.log({ user: this.user });

    console.log('google user', this.authService.googleUser);
    console.log('current user: ', this.user);

    const [err, res] = this.user.validate();

    if (res) {
      const is_provider = this.authService.googleUser ? true : false;

      this.store
        .dispatch(
          new AuthActions.Register({
            ...this.user.build(),

            is_provider,
            idToken: this.authService.googleUser?.authentication.idToken,
          })
        )
        .pipe()
        .subscribe(async () => {
          const user = this.store.selectSnapshot(AuthSelectors.getUser);
          console.log('🚀 ~ CompleteProfilePage ~ .subscribe ~ user:', user);

          this.apiService.dismissLoading();

          if (user) {
            this.router.navigate(['main-tabs'], { replaceUrl: true });
          }
        });
    } else if (err) {
      console.error('User is not valid', err.message);
      this.apiService.displayMessage(err.message, 'danger', 'warning-outline');
    }
    this.apiService.dismissLoading();
  }

  async openPicker() {
    const picker = await this.pickerCtrl.create({
      columns: this.generatePickerColumns(),
      buttons: this.generatePickerButtons(),
    });
    await picker.present();
  }

  generatePickerColumns() {
    return [
      {
        name: 'days',
        options: Array.from({ length: 31 }, (_, i) => ({
          text: `${i + 1}`,
          value: i + 1,
        })),
      },
      {
        name: 'months',
        options: Array.from({ length: 12 }, (_, i) => ({
          text: new Date(0, i).toLocaleString('en-EN', { month: 'long' }),
          value: i + 1,
        })),
      },
      {
        name: 'years',
        options: sort(
          Array.from(
            { length: new Date().getFullYear() - 1900 + 1 },
            (_, i) => ({
              text: `${1900 + i}`,
              value: 1900 + i,
            })
          ),
          (f) => f.value,
          true
        ),
      },
    ];
  }

  generatePickerButtons() {
    return [
      {
        text: 'Cancel',
        role: 'cancel',
      },
      {
        text: 'Confirm',
        handler: (value) => {
          this.handlePickerConfirm(value);
        },
      },
    ];
  }

  handlePickerConfirm(value) {
    let today = new Date();
    let age = differenceInYears(
      today,
      new Date(
        `${value.years.text}-${value.months.value + 1}-${value.days.text}`
      )
    );
    console.log('age is', age);
    if (age >= 12) {
      this.day = value.days.text;
      this.month = value.months.text;
      this.year = value.years.text;

      this.user.setBirthday(
        `${this.year}-${value.months.value + 1}-${this.day}`
      );
    } else {
      this.apiService.displayMessage(
        "We're sorry, but it appears that you don't meet the minimum age requirement to access this application.!",
        'danger',
        'warning-outline'
      );
    }
  }

  async takePicture() {
    console.log('from take picture');
    const image = await Camera.getPhoto({
      quality: 100,
      width: 500,
      allowEditing: false,
      resultType: CameraResultType.Base64,
    });

    const modal = await this.modalController.create({
      component: CroperComponent,
      // Optional: Pass data to the modal
      componentProps: {
        image: 'data:image/jpeg;base64,' + image.base64String,
      },
    });

    modal
      .onDidDismiss()
      .then((result: { role: string; data: { image: string } }) => {
        if (result.role !== 'cancel' && isObject(result.data)) {
          console.log('this.imageUrl', this.user.avatar);
          const data = result.data.image.replace('data:image/png;base64,', '');
          this.user.avatar = this.mediaService.base64ToBlob(data, 'image/png');

          this.isUpdate = true;
        }
      });
    await modal.present();
  }
  pickInterest(interest) {
    this.user.interests = interest.name;
    interest.selected = !interest.selected;
  }
}
