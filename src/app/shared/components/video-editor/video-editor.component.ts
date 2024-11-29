import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  ViewChild,
} from '@angular/core';
// import CreativeEditorSDK, { Configuration } from '@cesdk/cesdk-js';

@Component({
  selector: 'app-video-editor',
  templateUrl: './video-editor.component.html',
  styleUrls: ['./video-editor.component.scss'],
  standalone: true,
})
export class VideoEditorComponent implements AfterViewInit {
  @ViewChild('cesdk_container') containerRef: ElementRef = {} as ElementRef;
  video = input.required<Blob>();

  ngAfterViewInit(): void {
    // const config: Configuration = {
    //   ...environment.imageLy,
    //   callbacks: { onUpload: 'local' },
    // };
    // CreativeEditorSDK.create(this.containerRef.nativeElement, config).then(
    //   async (instance) => {
    //     // Do something with the instance of CreativeEditor SDK, for example:
    //     // Populate the asset library with default / demo asset sources.
    //     console.log(instance);
    //     instance.addDefaultAssetSources();
    //     instance.addDemoAssetSources({ sceneMode: 'Video' });
    //     await instance.createVideoScene();
    //   }
    // );
  }
}
