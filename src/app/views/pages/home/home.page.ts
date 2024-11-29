import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import {
  Gesture,
  GestureController,
  IonRouterOutlet,
  Platform,
} from '@ionic/angular';
import { AppService } from '@shared/services/app/app.service';

import { ApiService } from '@shared/services/api/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  img = 0;
  from = '';
  to = '';
  startWhene = false;
  direction = 0;
  swipeGesture!: Gesture;
  @ViewChild('contentElement', { static: true, read: ElementRef })
  contentElement!: ElementRef;
  public steeps = '';
  transition = false;
  submitted = false;
  halfWidth;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.halfWidth = window.screen.width / 2;
  }
  private backButtonSubscription: Subscription;
  private appService = inject(AppService);

  constructor(
    private platform: Platform,
    private router: Router,
    public apiService: ApiService,
    private routerOutlet: IonRouterOutlet,
    private gestureController: GestureController,
    private cdr: ChangeDetectorRef
  ) {
    this.halfWidth = window.screen.width / 2;
  }

  async ngOnInit() {
    await this.appService.checkRegistered();
    this.appService.checkNewUser(() => {
      this.apiService.img = 4;
      this.transition = false;
    });
  }

  ionViewWillEnter() {
    this.swipeGesture = this.gestureController.create({
      el: this.contentElement.nativeElement,
      gestureName: 'swipe',
      onEnd: (ev) => this.onSwipeEnd(ev),
    });
    this.swipeGesture.enable();

    this.routerOutlet.swipeGesture = false;

    this.backButtonSubscription =
      this.platform.backButton.subscribeWithPriority(10, () => {
        if (this.apiService.img == 0) {
          App.exitApp();
        }
        if (this.apiService.img == 4) {
          this.apiService.img = 3;
          this.transition = false;
        } else {
          this.prev();
        }
      });
  }

  goBack() {
    this.apiService.img = 3;
    this.transition = false;
  }

  ionViewDidLeave() {
    // Désenregistrement du gestionnaire personnalisé pour le bouton de retour
    this.backButtonSubscription.unsubscribe();

    // Réactivation de la sortie de l'application par geste de balayage
    this.routerOutlet.swipeGesture = true;
  }

  private onSwipeEnd(ev: any) {
    if (ev.velocityX > 0) {
      this.prev();
    } else {
      this.next();
    }
  }
  nextView() {
    this.apiService.img = 4;

    this.transition = true;
    this.cdr.detectChanges();
  }
  next() {
    // parent.location.hash = "hello";
    console.log(this.apiService.img);
    if (this.apiService.img >= 0 && this.apiService.img < 3) {
      this.direction = 1;
      var animation = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'animate'
      );
      var animation2 = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'animate'
      );

      var animation3 = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'animate'
      );

      var animation4 = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'animate'
      );

      if (this.apiService.img == 0) {
        animation.setAttributeNS(null, 'attributeName', 'd');
        animation.setAttributeNS(null, 'from', 'M-4005.5,126.846l0-0');
        animation.setAttributeNS(null, 'to', 'M-4005.5,126.846l16.322-16.328');
        animation.setAttributeNS(null, 'dur', '0.3s');
        animation.setAttributeNS(null, 'fill', 'freeze');
        animation.setAttributeNS(null, 'id', 'elem1');
        document.getElementById('Path_495')?.appendChild(animation);

        animation2.setAttributeNS(null, 'attributeName', 'd');
        animation2.setAttributeNS(null, 'from', 'M-4005.5,123.711l0-0');
        animation2.setAttributeNS(null, 'to', 'M-4005.5,123.711l13.188-13.192');
        animation2.setAttributeNS(null, 'dur', '0.3s');
        animation2.setAttributeNS(null, 'fill', 'freeze');
        animation2.setAttributeNS(null, 'id', 'elem2');
        document.getElementById('Path_494')?.appendChild(animation2);

        animation3.setAttributeNS(null, 'attributeName', 'd');
        animation3.setAttributeNS(null, 'from', 'M-3957.263,142.263V140');
        animation3.setAttributeNS(null, 'to', 'M-3957.263,142.263V111.351');
        animation3.setAttributeNS(null, 'dur', '0.3s');
        animation3.setAttributeNS(null, 'fill', 'freeze');
        animation3.setAttributeNS(null, 'id', 'elem2');
        document.getElementById('Path_496')?.appendChild(animation3);

        animation4.setAttributeNS(null, 'attributeName', 'd');
        animation4.setAttributeNS(null, 'from', 'M -3957.5 111.777 V 111');
        animation4.setAttributeNS(null, 'to', 'M -3957.5 129.777 V 111');
        animation4.setAttributeNS(null, 'dur', '0.3s');
        animation4.setAttributeNS(null, 'fill', 'freeze');
        animation4.setAttributeNS(null, 'id', 'elem2');
        document.getElementById('my_Path_495')?.appendChild(animation4);
      } else if (this.apiService.img == 1) {
        animation.setAttributeNS(null, 'attributeName', 'd');
        animation.setAttributeNS(
          null,
          'from',
          'M-4005.5,126.846l16.322-16.328'
        );
        animation.setAttributeNS(
          null,
          'to',
          'M -4005.5 126.545 l 29.016 -29.027'
        );
        animation.setAttributeNS(null, 'dur', '0.3s');
        animation.setAttributeNS(null, 'fill', 'freeze');
        animation.setAttributeNS(null, 'id', 'elem1');
        document.getElementById('Path_495')?.appendChild(animation);

        animation2.setAttributeNS(null, 'attributeName', 'd');
        animation2.setAttributeNS(
          null,
          'from',
          'M-4005.5,123.711l13.188-13.192'
        );
        animation2.setAttributeNS(
          null,
          'to',
          'M-4005.5,123.711l29.016-29.0.27'
        );
        animation2.setAttributeNS(null, 'dur', '0.3s');
        animation2.setAttributeNS(null, 'fill', 'freeze');
        animation2.setAttributeNS(null, 'id', 'elem2');
        document.getElementById('Path_494')?.appendChild(animation2);

        animation3.setAttributeNS(null, 'attributeName', 'd');
        animation3.setAttributeNS(null, 'from', 'M-3957.263,142.263V111.351');
        animation3.setAttributeNS(null, 'to', 'M-3957.263,142.263V80.351');
        animation3.setAttributeNS(null, 'dur', '0.3s');
        animation3.setAttributeNS(null, 'fill', 'freeze');
        animation3.setAttributeNS(null, 'id', 'elem2');
        document.getElementById('Path_496')?.appendChild(animation3);

        animation4.setAttributeNS(null, 'attributeName', 'd');
        animation4.setAttributeNS(null, 'from', 'M -3957.5 129.777 V 111');
        animation4.setAttributeNS(null, 'to', 'M -3957.5 138.777 V 111');
        animation4.setAttributeNS(null, 'dur', '0.3s');
        animation4.setAttributeNS(null, 'fill', 'freeze');
        animation4.setAttributeNS(null, 'id', 'elem2');
        document.getElementById('my_Path_495')?.appendChild(animation4);
      } else if (this.apiService.img == 2) {
        animation.setAttributeNS(null, 'attributeName', 'd');
        animation.setAttributeNS(
          null,
          'from',
          'M -4005.5 126.545 l 29.016 -29.027'
        );
        animation.setAttributeNS(
          null,
          'to',
          'M-4005.5,126.545 l 48.241-48.259'
        );
        animation.setAttributeNS(null, 'dur', '0.3s');
        animation.setAttributeNS(null, 'fill', 'freeze');
        animation.setAttributeNS(null, 'id', 'elem1');
        document.getElementById('Path_495')?.appendChild(animation);

        animation2.setAttributeNS(null, 'attributeName', 'd');
        animation2.setAttributeNS(
          null,
          'from',
          'M-4005.5,123.711l29.016-29.0.27'
        );
        animation2.setAttributeNS(null, 'to', 'M-4005.5,123.711l48.241-48.259');
        animation2.setAttributeNS(null, 'dur', '0.3s');
        animation2.setAttributeNS(null, 'fill', 'freeze');
        animation2.setAttributeNS(null, 'id', 'elem2');
        document.getElementById('Path_494')?.appendChild(animation2);

        animation3.setAttributeNS(null, 'attributeName', 'd');
        animation3.setAttributeNS(null, 'from', 'M-3957.263,142.263V80.351');
        animation3.setAttributeNS(null, 'to', 'M-3957.263,142.263V48');
        animation3.setAttributeNS(null, 'dur', '0.3s');
        animation3.setAttributeNS(null, 'fill', 'freeze');
        animation3.setAttributeNS(null, 'id', 'elem2');
        document.getElementById('Path_496')?.appendChild(animation3);

        animation4.setAttributeNS(null, 'attributeName', 'd');
        animation4.setAttributeNS(null, 'from', 'M -3957.5 138.777 V 111');
        animation4.setAttributeNS(null, 'to', 'M -3957.5 150.777 V 111');
        animation4.setAttributeNS(null, 'dur', '0.3s');
        animation4.setAttributeNS(null, 'fill', 'freeze');
        animation4.setAttributeNS(null, 'id', 'elem2');
        document.getElementById('my_Path_495')?.appendChild(animation4);
      }
      animation.beginElement();
      animation2.beginElement();
      animation3.beginElement();
      animation4.beginElement();
      // setTimeout(() => {
      //   animation.remove()
      // }, 1500)

      this.apiService.img = this.apiService.img + 1;
      this.cdr.detectChanges();
      this.startWhene = true;

      console.log(this.apiService.img);
    }
  }

  onGesture(event: any) {
    console.log(event);
    if (event.direction === 'x') {
      if (event.deltaX > 0) {
        console.log('Swipe right');
      } else {
        console.log('Swipe left');
      }
    }
  }
  prev() {
    console.log(this.apiService.img);
    if (this.apiService.img > 0 && this.apiService.img <= 3) {
      this.apiService.img = this.apiService.img - 1;
      this.cdr.detectChanges();
      this.direction = 1;
      var animation = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'animate'
      );
      var animation2 = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'animate'
      );

      var animation3 = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'animate'
      );

      var animation4 = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'animate'
      );
      // set its attributes
      if (this.apiService.img == 0) {
        animation.setAttributeNS(null, 'attributeName', 'd');
        animation.setAttributeNS(
          null,
          'from',
          'M-4005.5,126.846l16.322-16.328'
        );
        animation.setAttributeNS(null, 'to', 'M-4005.5,126.846l0-0');
        animation.setAttributeNS(null, 'dur', '0.3s');
        animation.setAttributeNS(null, 'fill', 'freeze');
        animation.setAttributeNS(null, 'id', 'elem1');
        document.getElementById('Path_495')?.appendChild(animation);

        animation2.setAttributeNS(null, 'attributeName', 'd');
        animation2.setAttributeNS(
          null,
          'from',
          'M-4005.5,123.711l13.188-13.192'
        );
        animation2.setAttributeNS(null, 'to', 'M-4005.5,123.711l0-0');
        animation2.setAttributeNS(null, 'dur', '0.3s');
        animation2.setAttributeNS(null, 'fill', 'freeze');
        animation2.setAttributeNS(null, 'id', 'elem2');
        document.getElementById('Path_494')?.appendChild(animation2);

        animation3.setAttributeNS(null, 'attributeName', 'd');
        animation3.setAttributeNS(null, 'from', 'M-3957.263,142.263V111.351');
        animation3.setAttributeNS(null, 'to', 'M-3957.263,142.263V140');
        animation3.setAttributeNS(null, 'dur', '0.3s');
        animation3.setAttributeNS(null, 'fill', 'freeze');
        animation3.setAttributeNS(null, 'id', 'elem2');
        document.getElementById('Path_496')?.appendChild(animation3);

        animation4.setAttributeNS(null, 'attributeName', 'd');
        animation4.setAttributeNS(null, 'from', 'M -3957.5 129.777 V 111');
        animation4.setAttributeNS(null, 'to', 'M -3957.5 111.777 V 111');
        animation4.setAttributeNS(null, 'dur', '0.3s');
        animation4.setAttributeNS(null, 'fill', 'freeze');
        animation4.setAttributeNS(null, 'id', 'elem2');
        document.getElementById('my_Path_495')?.appendChild(animation4);
      } else if (this.apiService.img == 1) {
        animation.setAttributeNS(null, 'attributeName', 'd');
        animation.setAttributeNS(
          null,
          'from',
          'M -4005.5 126.545 l 29.016 -29.027'
        );
        animation.setAttributeNS(null, 'to', 'M-4005.5,126.846l16.322-16.328');
        animation.setAttributeNS(null, 'dur', '0.3s');
        animation.setAttributeNS(null, 'fill', 'freeze');
        animation.setAttributeNS(null, 'id', 'elem1');
        document.getElementById('Path_495')?.appendChild(animation);

        animation2.setAttributeNS(null, 'attributeName', 'd');
        animation2.setAttributeNS(
          null,
          'from',
          'M-4005.5,123.711l29.016-29.0.27'
        );
        animation2.setAttributeNS(null, 'to', 'M-4005.5,123.711l13.188-13.192');
        animation2.setAttributeNS(null, 'dur', '0.3s');
        animation2.setAttributeNS(null, 'fill', 'freeze');
        animation2.setAttributeNS(null, 'id', 'elem2');
        document.getElementById('Path_494')?.appendChild(animation2);

        animation3.setAttributeNS(null, 'attributeName', 'd');
        animation3.setAttributeNS(null, 'from', 'M-3957.263,142.263V80.351');
        animation3.setAttributeNS(null, 'to', 'M-3957.263,142.263V111.351');
        animation3.setAttributeNS(null, 'dur', '0.3s');
        animation3.setAttributeNS(null, 'fill', 'freeze');
        animation3.setAttributeNS(null, 'id', 'elem2');
        document.getElementById('Path_496')?.appendChild(animation3);

        animation4.setAttributeNS(null, 'attributeName', 'd');
        animation4.setAttributeNS(null, 'from', 'M -3957.5 138.777 V 111');
        animation4.setAttributeNS(null, 'to', 'M -3957.5 129.777 V 111');
        animation4.setAttributeNS(null, 'dur', '0.3s');
        animation4.setAttributeNS(null, 'fill', 'freeze');
        animation4.setAttributeNS(null, 'id', 'elem2');
        document.getElementById('my_Path_495')?.appendChild(animation4);
      } else if (this.apiService.img == 2) {
        animation.setAttributeNS(null, 'attributeName', 'd');
        animation.setAttributeNS(
          null,
          'from',
          'M-4005.5,126.545 l 48.241-48.259'
        );
        animation.setAttributeNS(
          null,
          'to',
          'M -4005.5 126.545 l 29.016 -29.027'
        );
        animation.setAttributeNS(null, 'dur', '0.3s');
        animation.setAttributeNS(null, 'fill', 'freeze');
        animation.setAttributeNS(null, 'id', 'elem1');
        document.getElementById('Path_495')?.appendChild(animation);

        animation2.setAttributeNS(null, 'attributeName', 'd');
        animation2.setAttributeNS(
          null,
          'from',
          'M-4005.5,123.711l48.241-48.259'
        );
        animation2.setAttributeNS(
          null,
          'to',
          'M-4005.5,123.711l29.016-29.0.27'
        );
        animation2.setAttributeNS(null, 'dur', '0.3s');
        animation2.setAttributeNS(null, 'fill', 'freeze');
        animation2.setAttributeNS(null, 'id', 'elem2');
        document.getElementById('Path_494')?.appendChild(animation2);

        animation3.setAttributeNS(null, 'attributeName', 'd');
        animation3.setAttributeNS(null, 'from', 'M-3957.263,142.263V48');
        animation3.setAttributeNS(null, 'to', 'M-3957.263,142.263V80.351');
        animation3.setAttributeNS(null, 'dur', '0.3s');
        animation3.setAttributeNS(null, 'fill', 'freeze');
        animation3.setAttributeNS(null, 'id', 'elem2');
        document.getElementById('Path_496')?.appendChild(animation3);

        animation4.setAttributeNS(null, 'attributeName', 'd');
        animation4.setAttributeNS(null, 'from', 'M -3957.5 150.777 V 111');
        animation4.setAttributeNS(null, 'to', 'M -3957.5 138.777 V 111');
        animation4.setAttributeNS(null, 'dur', '0.3s');
        animation4.setAttributeNS(null, 'fill', 'freeze');
        animation4.setAttributeNS(null, 'id', 'elem2');
        document.getElementById('my_Path_495')?.appendChild(animation4);
      }
      animation.beginElement();
      animation2.beginElement();
      animation3.beginElement();
      animation4.beginElement();

      if (this.apiService.img == 0) {
        setTimeout(() => {
          document.getElementById('my_Path_495')?.replaceChildren();
          document.getElementById('Path_495')?.replaceChildren();
          document.getElementById('Path_494')?.replaceChildren();
          document.getElementById('Path_496')?.replaceChildren();
        }, 400);
      }
    }
  }

  goToSignIn() {
    this.router.navigate(['/sign-in']);
  }

  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}
