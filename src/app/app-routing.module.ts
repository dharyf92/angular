import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { isAuthenticated } from '@core/guards/auth.guard';
import { isNotAuthenticated } from '@core/guards/no-auth.guard';

const routes: Routes = [
  {
    path: 'home',
    canActivate: [isNotAuthenticated],

    loadChildren: () =>
      import('./views/pages/home/home.module').then((m) => m.HomePageModule),
  },

  {
    path: 'sign-up',
    canActivate: [isNotAuthenticated],

    loadChildren: () =>
      import('./views/pages/sign-up/sign-up.module').then(
        (m) => m.SignUpPageModule
      ),
  },
  {
    path: 'complete-profile',
    canActivate: [isNotAuthenticated],

    loadChildren: () =>
      import('./views/pages/complete-profile/complete-profile.module').then(
        (m) => m.CompleteProfilePageModule
      ),
  },
  {
    path: 'sign-in',
    canActivate: [isNotAuthenticated],

    loadChildren: () =>
      import('./views/pages/sign-in/sign-in.module').then(
        (m) => m.SignInPageModule
      ),
  },
  {
    path: 'reset-password',
    canActivate: [isNotAuthenticated],

    loadChildren: () =>
      import('./views/pages/reset-password/reset-password.module').then(
        (m) => m.ResetPasswordPageModule
      ),
  },
  {
    path: 'reset-password-code',
    canActivate: [isNotAuthenticated],

    loadChildren: () =>
      import(
        './views/pages/reset-password-code/reset-password-code.module'
      ).then((m) => m.ResetPasswordCodePageModule),
  },

  {
    path: 'create-new-password',

    loadChildren: () =>
      import(
        './views/pages/create-new-password/create-new-password.module'
      ).then((m) => m.CreateNewPasswordPageModule),
  },
  {
    path: 'success-new-password',

    loadChildren: () =>
      import(
        './views/pages/success-new-password/success-new-password.module'
      ).then((m) => m.SuccessNewPasswordPageModule),
  },
  {
    path: 'welcome-to-one-pick',
    canActivate: [isAuthenticated],
    loadChildren: () =>
      import(
        './views/pages/welcome-to-one-pick/welcome-to-one-pick.module'
      ).then((m) => m.WelcomeToOnePickPageModule),
  },

  {
    path: 'main-tabs',
    canActivate: [isAuthenticated],
    loadChildren: () =>
      import('./views/pages/main-tabs/main-tabs.module').then(
        (m) => m.MainTabsPageModule
      ),
  },
  {
    path: 'main-clips',
    canActivate: [isAuthenticated],
    loadChildren: () =>
      import('./views/pages/main-clips/main-clips.module').then(
        (m) => m.MainClipsPageModule
      ),
  },
  {
    path: 'main-account',
    canActivate: [isAuthenticated],
    loadChildren: () =>
      import('./views/pages/main-account/main-account.module').then(
        (m) => m.MainAccountPageModule
      ),
  },
  {
    path: 'list-pickers',
    canActivate: [isAuthenticated],
    loadChildren: () =>
      import('./views/pages/list-pickers/list-pickers.module').then(
        (m) => m.ListPickersPageModule
      ),
  },

  {
    path: 'account-interests',
    canActivate: [isAuthenticated],
    loadChildren: () =>
      import('./views/pages/account-interests/account-interests.module').then(
        (m) => m.AccountInterestsPageModule
      ),
  },
  {
    path: 'language-choice',
    canActivate: [isAuthenticated],
    loadChildren: () =>
      import('./views/pages/language-choice/language-choice.module').then(
        (m) => m.LanguageChoicePageModule
      ),
  },
  {
    path: 'blocked-pickers',
    canActivate: [isAuthenticated],
    loadChildren: () =>
      import('./views/pages/blocked-pickers/blocked-pickers.module').then(
        (m) => m.BlockedPickersPageModule
      ),
  },
  {
    path: 'contact-us',
    canActivate: [isAuthenticated],
    loadChildren: () =>
      import('./views/pages/contact-us/contact-us.module').then(
        (m) => m.ContactUsPageModule
      ),
  },
  {
    path: 'about',
    canActivate: [isAuthenticated],
    loadChildren: () =>
      import('./views/pages/about/about.module').then((m) => m.AboutPageModule),
  },
  {
    path: 'terms-conditions',
    canActivate: [isAuthenticated],
    loadChildren: () =>
      import('./views/pages/terms-conditions/terms-conditions.module').then(
        (m) => m.TermsConditionsPageModule
      ),
  },
  {
    path: 'privacy-policy',
    canActivate: [isAuthenticated],
    loadChildren: () =>
      import('./views/pages/privacy-policy/privacy-policy.module').then(
        (m) => m.PrivacyPolicyPageModule
      ),
  },

  {
    path: 'suggestions',
    canActivate: [isAuthenticated],
    loadChildren: () =>
      import('./views/pages/suggestions/suggestions.module').then(
        (m) => m.SuggestionsPageModule
      ),
  },

  {
    path: 'report/:id',
    canActivate: [isAuthenticated],
    loadChildren: () =>
      import('./views/pages/report/report.module').then(
        (m) => m.ReportPageModule
      ),
  },

  {
    path: 'phone-verification',
    canActivate: [isAuthenticated],
    loadChildren: () =>
      import('./views/pages/phone-verification/phone-verification.module').then(
        (m) => m.PhoneVerificationPageModule
      ),
  },
  {
    path: 'otpget',
    canActivate: [isAuthenticated],
    loadChildren: () =>
      import('./views/pages/otpget/otpget.module').then(
        (m) => m.OtpgetPageModule
      ),
  },
  {
    path: 'invite-friends',
    canActivate: [isAuthenticated],
    loadChildren: () =>
      import('./views/pages/invite-friends/invite-friends.module').then(
        (m) => m.InviteFriendsPageModule
      ),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      onSameUrlNavigation: 'reload',
      bindToComponentInputs: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
