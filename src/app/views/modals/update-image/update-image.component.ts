import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PinturaEditorComponent } from '@pqina/angular-pintura';

// pintura
import {
  LocaleAnnotate,
  LocaleCore,
  LocaleCrop,
  LocaleFilter,
  LocaleFinetune,
  LocaleMarkupEditor,
} from '@pqina/pintura/locale/en_GB';

import { ModalController, NavParams } from '@ionic/angular';
import {
  // editor
  createDefaultImageReader,
  createDefaultImageWriter,
  createDefaultShapePreprocessor,
  markup_editor_defaults,
  plugin_annotate,
  plugin_crop,
  plugin_filter,
  plugin_filter_defaults,
  plugin_finetune,
  plugin_finetune_defaults,
  // plugins
  setPlugins,
} from '@pqina/pintura';

setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_annotate);

@Component({
  selector: 'app-update-image',
  templateUrl: './update-image.component.html',
  styleUrls: ['./update-image.component.scss'],
})
export class UpdateImageComponent {
  @ViewChild('inlineEditor') inlineEditor?: PinturaEditorComponent<any> =
    undefined;
  isUpdate = true;
  inlineResultBase64;
  constructor(
    private sanitizer: DomSanitizer,
    private modalController: ModalController,
    private navParams: NavParams
  ) {
    this.inlineSrc = this.navParams.get('image');
  }

  // editor generic state
  editorOptions: any = {
    imageReader: createDefaultImageReader(),
    imageWriter: createDefaultImageWriter(),
    shapePreprocessor: createDefaultShapePreprocessor(),
    ...plugin_finetune_defaults,
    ...plugin_filter_defaults,
    ...markup_editor_defaults,
    locale: {
      ...LocaleCore,
      ...LocaleCrop,
      ...LocaleFinetune,
      ...LocaleFilter,
      ...LocaleAnnotate,
      ...LocaleMarkupEditor,
    },
  };

  // inline
  inlineSrc: string =
    'data:image/jpeg;base64,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';
  inlineResult?: string = undefined;
  inlineCropAspectRatio = 1;

  handleInlineLoad($event: any) {
    console.log('inline load', $event);

    console.log('inline component ref', this.inlineEditor);

    console.log('inline editor instance ref', this.inlineEditor?.editor);

    console.log(
      'inline editor image state',
      this.inlineEditor?.editor?.imageState
    );
  }

  handleInlineProcess($event: any) {
    console.log('inline process', $event);

    const objectURL = URL.createObjectURL($event.dest);
    console.log(objectURL);

    // Fetch the media file
    fetch(objectURL)
      .then((response) => response.blob())
      .then((blob) => {
        // Convert the blob to a base64 string
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string; // Reader result is a string
          const base64Content = base64String.split(',')[1]; // Extracting only the base64 part
          const base64WithPrefix = 'data:image/png;base64,' + base64Content; // Add prefix
          console.log(base64WithPrefix);

          // Now you can use the base64 string as needed
          this.inlineResultBase64 = base64WithPrefix;
        };
        reader.readAsDataURL(blob);
      });

    console.log(this.inlineResultBase64);
    this.isUpdate = false;
  }

  // modal
  modalSrc: string = 'assets/image.jpeg';
  modalResult?: string = undefined;
  modalVisible: boolean = false;

  handleModalLoad($event: any) {
    console.log('modal load', $event);
  }

  handleModalProcess($event: any) {
    console.log('modal process', $event);
    const objectURL = URL.createObjectURL($event.dest);
    this.modalResult = this.sanitizer.bypassSecurityTrustResourceUrl(
      objectURL
    ) as string;
  }

  // overlay
  overlaySrc: string = 'assets/image.jpeg';
  overlayVisible: boolean = false;
  overlayResult?: string = undefined;
  overlayOptions: any = {
    imageReader: createDefaultImageReader(),
    imageWriter: createDefaultImageWriter(),
    locale: {
      ...LocaleCore,
      ...LocaleCrop,
    },
  };

  handleOverlayLoad($event: any) {
    console.log('overlay load', $event);
  }

  handleOverlayProcess($event: any) {
    const objectURL = URL.createObjectURL($event.dest);
    this.overlayResult = this.sanitizer.bypassSecurityTrustResourceUrl(
      objectURL
    ) as string;
    this.overlayOptions = {
      ...this.overlayOptions,
      imageState: $event.imageState,
    };

    this.overlayVisible = false;
  }

  pondHandleInit() {
    console.log('FilePond has initialised');
  }

  pondHandleAddFile(event: any) {
    console.log('A file was added', event);
  }

  pondHandlePrepareFile(event: any) {
    console.log('A file was prepared', event);
    // Append output image to page for testing
    // const url = URL.createObjectURL(event.output);
    // const img = new Image();
    // img.src = url;
    // document.body.append(img);
  }

  pondHandleActivateFile(event: any) {
    console.log('A file was activated', event);
  }

  closeModalWithoutThem() {
    this.modalController.dismiss({}, 'cancel');
  }

  saveImage() {
    this.modalController.dismiss({ image: this.inlineResultBase64 });
  }
}
