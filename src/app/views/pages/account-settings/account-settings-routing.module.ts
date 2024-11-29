import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountSettingsPage } from './account-settings.page';
import { ManagePickerAccountComponent } from './manage-picker-account/manage-picker-account.component';
import { ChangePhoneComponent } from './change-phone/change-phone.component';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { AccountInterestsComponent } from './account-interests/account-interests.component';
import { LanguageChoiceComponent } from './language-choice/language-choice.component';
import { BlockedUsersComponent } from './blocked-users/blocked-users.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SwitchAccountTypeComponent } from './switch-account-type/switch-account-type.component';

const routes: Routes = [
  {
    path: '',
    component: AccountSettingsPage
  },{
    path: 'manage_account',
    component: ManagePickerAccountComponent
  },{
    path: 'change-phone',
    component: ChangePhoneComponent
  },{
    path: 'change-email',
    component: ChangeEmailComponent
  }
  ,{
    path: 'change-password',
    component: ChangePasswordComponent
  },{
    path: 'terms-conditions',
    component: TermsConditionsComponent
  },{
    path: 'change-interests',
    component: AccountInterestsComponent
  },{
    path: 'change-language',
    component: LanguageChoiceComponent
  },{
    path: 'blocked-users',
    component: BlockedUsersComponent
  },{
    path: 'contact-us',
    component: ContactUsComponent
  },{
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },{
    path: 'switch-account',
    component: SwitchAccountTypeComponent
  }
  

  
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountSettingsPageRoutingModule {}
