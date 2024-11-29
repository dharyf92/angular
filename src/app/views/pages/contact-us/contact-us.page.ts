import { Component, OnInit } from '@angular/core';
import { UserService } from '@shared/services/user/user.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
  reason = 'Information Request';
  message = '';
  reasons;
  constructor(private userService: UserService) {}

  ngOnInit() {}
}
