import { Injectable } from '@angular/core';

import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { UserPhoto } from '../interfaces/photo';

import { Filesystem, Directory, ReadFileResult } from '@capacitor/filesystem';

import { GetResult, Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photos: UserPhoto[] = [];

  private PHOTOS_STORAGE: string = 'photos';

  public async addNewToGalery(): Promise<void> {
    const capturedPhoto: Photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const savedPhoto: UserPhoto = await this.savePicture(capturedPhoto);

    this.photos.unshift(savedPhoto);

    Preferences.set({
      key: this.PHOTOS_STORAGE,
      value: JSON.stringify(this.photos),
    });
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

  public async loadSaved(): Promise<void> {
    const { value: photoList }: GetResult = await Preferences.get({
      key: this.PHOTOS_STORAGE,
    });

    this.photos = (photoList ? JSON.parse(photoList) : []) as UserPhoto[];

    for (let photo of this.photos) {
      const readFile: ReadFileResult = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data,
      });

      if (readFile.data instanceof Blob) {
        photo.webviewPath = await this.convertBlobToBase64(readFile.data);
      } else {
        const data: string = readFile.data as string;
        photo.webviewPath = data.startsWith('data:')
          ? data
          : `data:image/jpeg;base64,${data}`;
      }
    }
  }
}
