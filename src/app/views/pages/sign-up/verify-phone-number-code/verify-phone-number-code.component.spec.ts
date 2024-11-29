import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerifyPhoneNumberCodeComponent } from './verify-phone-number-code.component';

describe('VerifyPhoneNumberCodeComponent', () => {
  let component: VerifyPhoneNumberCodeComponent;
  let fixture: ComponentFixture<VerifyPhoneNumberCodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyPhoneNumberCodeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyPhoneNumberCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
