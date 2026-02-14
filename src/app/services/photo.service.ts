import { Injectable } from '@angular/core';

import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { UserPhoto } from '../interfaces/photo';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private photos: UserPhoto[] = [];

  public async addNewToGalery(): Promise<void> {
    const capturedPhoto: Photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const savedPhoto = await this.savePicture(capturedPhoto);

    this.photos.unshift(savedPhoto);
  }

  public async savePicture(photo: Photo): Promise<UserPhoto> {
    return {
      filepath: '',
      webviewPath: '',
    };
  }
}
