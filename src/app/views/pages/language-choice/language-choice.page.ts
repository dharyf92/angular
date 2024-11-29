import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-language-choice',
  templateUrl: './language-choice.page.html',
  styleUrls: ['./language-choice.page.scss'],
})
export class LanguageChoicePage implements OnInit {

  choice = 2;
  constructor() { }

  ngOnInit() {
  }

  choose(num) {
    this.choice = num;
  }

  finalChoice() {
    console.log('chose ' , this.choice);
  }

}
