import { Injectable } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Directory } from '@capacitor/filesystem';
import { VideoFrame, VideoToFramesMethod } from '@shared/libs/video-frame';
import write_blob from 'capacitor-blob-writer';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  async storeVideo(blob: Blob) {
    try {
      const fileName = new Date().getTime() + '.mp4';

      const savedFile = await write_blob({
        path: fileName,
        blob,
        directory: Directory.Data,
      });

      return { path: savedFile, name: fileName };
    } catch (error) {
      console.error(error);
      alert('error');
    }
  }

  getFileAsBlob = async (uri: string) => {
    const webPath = Capacitor.convertFileSrc(uri);
    const response = await fetch(webPath);
    return response.blob();
  };

  getThumbnail = async (blob: Blob) => {
    const url = URL.createObjectURL(blob);

    const [thumbnail] = await VideoFrame.getFrames(
      url,
      1,
      VideoToFramesMethod.totalFrames
    );

    return this.base64ToBlob(thumbnail);
  };

  takePicture = async () => {
    return Camera.getPhoto({
      quality: 100,
      width: 500,
      allowEditing: false,
      resultType: CameraResultType.Base64,
    });
  };

  base64ToBlob(base64: string, contentType = ''): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }
}
