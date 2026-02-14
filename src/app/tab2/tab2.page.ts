import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { PhotoService } from '../services/photo.service';

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
    IonList,
    IonItem,
    IonLabel,
  ],
})
export class Tab2Page {
  constructor(public photoService: PhotoService) {}

  async ngOnInit() {
    await this.photoService.loadSaved();
  }

  async addNewToGalery() {
    await this.photoService.addNewToGalery();
  }
}
