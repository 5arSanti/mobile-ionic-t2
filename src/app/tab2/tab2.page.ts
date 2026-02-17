import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonLabel, IonImg, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';
import { PhotoService } from '../services/photo.service';
import { UserPhoto } from '../interfaces/photo';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonImg,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
],
})
export class Tab2Page {
  constructor(
    public photoService: PhotoService,
    public actionSheetController: ActionSheetController,
  ) {}

  async ngOnInit() {
    await this.photoService.loadSaved();
  }

  async addNewToGalery() {
    await this.photoService.addNewToGalery();
  }

  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet: HTMLIonActionSheetElement =
      await this.actionSheetController.create({
        header: 'Photos',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            icon: 'trash',
            handler: () => {
              this.photoService.deletePhoto(photo, position);
            },
          },
          {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel',
            handler: () => {},
          },
        ],
      });
    await actionSheet.present();
  }
}
