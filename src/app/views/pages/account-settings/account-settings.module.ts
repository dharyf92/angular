import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountSettingsPageRoutingModule } from './account-settings-routing.module';

import { AvatarComponent } from '@shared/components/avatar/avatar.component';
import { TelInputComponent } from '@shared/components/tel-input/tel-input.component';
import { SharedModule } from '@shared/modules/shared-module/SharedModule.module';
import { AccountInterestsComponent } from './account-interests/account-interests.component';
import { AccountSettingsPage } from './account-settings.page';
import { BlockedUsersComponent } from './blocked-users/blocked-users.component';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangePhoneComponent } from './change-phone/change-phone.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { LanguageChoiceComponent } from './language-choice/language-choice.component';
import { ManagePickerAccountComponent } from './manage-picker-account/manage-picker-account.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SwitchAccountTypeComponent } from './switch-account-type/switch-account-type.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountSettingsPageRoutingModule,
    SharedModule,
    AvatarComponent,
  ],
  declarations: [
    AccountSettingsPage,
    BlockedUsersComponent,
    AccountInterestsComponent,
    ManagePickerAccountComponent,
    PrivacyPolicyComponent,
    TermsConditionsComponent,
    LanguageChoiceComponent,
    ContactUsComponent,
    SwitchAccountTypeComponent,
    ChangePhoneComponent,
    ChangeEmailComponent,
    ChangePasswordComponent,
    TelInputComponent,
  ],
})
export class AccountSettingsPageModule {}
