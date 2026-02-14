import { Injectable } from '@angular/core';

import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { UserPhoto } from '../interfaces/photo';

import { Filesystem, Directory } from '@capacitor/filesystem';

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

    const savedPhoto: UserPhoto = await this.savePicture(capturedPhoto);

    this.photos.unshift(savedPhoto);
  }

  public async savePicture(photo: Photo): Promise<UserPhoto> {
    const response: Response = await fetch(photo.webPath!);
    const blob: Blob = await response.blob();
    const base64Data: string = (await this.convertBlobToBase64(blob)) as string;

    const fileName: string = Date.now() + '.jpeg';
    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    const userPhoto: UserPhoto = {
      filepath: fileName,
      webviewPath: photo.webPath,
    };

    return userPhoto;
  }

  private convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }
}
