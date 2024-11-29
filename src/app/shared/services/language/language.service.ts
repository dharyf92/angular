import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'
import { Storage } from '@ionic/storage';
const LNG_KEY = 'selected_language'
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selected = '';
  constructor(private translate: TranslateService, private storage:Storage) { }

  setInitLang(){
    let lang = this.translate.getBrowserLang();
    this.translate.setDefaultLang(lang);
    this.storage.get(LNG_KEY).then(val=>{
      if(val){
        this.setLanguage(val);
        this.selected = val;
      }
    })
  }

  setLanguage(lng){
    this.translate.use(lng);
    this.selected = lng
    this.storage.set(LNG_KEY,lng);
  }
}
