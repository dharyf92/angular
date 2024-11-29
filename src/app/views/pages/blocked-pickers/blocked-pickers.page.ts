import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-blocked-pickers',
  templateUrl: './blocked-pickers.page.html',
  styleUrls: ['./blocked-pickers.page.scss'],
})
export class BlockedPickersPage implements OnInit {

  constructor(private actionSheet : ActionSheetController  , private modalController : ModalController) { }

  ngOnInit() {
    
  }

  async presentactionSheet2(id) {
    
    const actionSheet = await this.actionSheet.create({
      header: 'Kristin will now be able to see your picks, pick and suggest. They won’t be notified that you unblocked them',
      buttons: [
        {
          text: 'Unblock',
          cssClass:'action-button' , 
          handler() {
            let element = document.getElementById(id);
            element.style.display = 'none';
          },
        },
        {
          text: '',
          cssClass:'action-button' , 
          handler() {
          },
        },
      ]
    });
    
    await actionSheet.present();
  };

  closeModalWithoutThem() {
    this.modalController.dismiss({},'cancel');
  }

}
