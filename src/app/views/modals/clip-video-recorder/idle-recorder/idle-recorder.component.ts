import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-idle-recorder',
  templateUrl: './idle-recorder.component.html',
  styleUrls: ['./idle-recorder.component.scss'],
})
export class IdleRecorderComponent implements OnInit, OnDestroy {
  @Output() launchRecorderEvent = new EventEmitter<Blob>();
  @ViewChild('video') captureElement: ElementRef<HTMLVideoElement>;

  // for camera
  cameraPosition: 'user' | 'environment' = 'environment';

  // for recording
  isRecording = signal(false);
  isReady = signal(false);

  // duration
  durations = [15, 30, 45];
  durationActive = this.durations[0];
  durationId: any;

  private mediaRecorder: MediaRecorder;
  private stream: MediaStream;
  private audioStream: MediaStream;

  // progress bar
  intervalId: any;
  progress = 0;

  private isCancelled!: boolean;

  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly modalController = inject(ModalController);

  ngOnInit() {
    this.isCancelled = false;
    this.initialize();
  }

  async initialize() {
    // Create a stream of video capturing
    const videoStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { max: 640 },
        height: { max: 480 },
        facingMode: [this.cameraPosition],
      },
      audio: false,
    });

    // Create a stream of audio capturing
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video: false,
    });

    this.audioStream = audioStream;

    // Create an audio context
    const audioContext = new AudioContext();

    // Create a source from the audio stream
    const source = audioContext.createMediaStreamSource(audioStream);

    // Create a gain node to control the volume
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.8; // Ajuster le volume si nécessaire

    // Create a compressor to reduce the dynamic sound
    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.value = -50;
    compressor.knee.value = 40;
    compressor.ratio.value = 12;
    compressor.attack.value = 0;
    compressor.release.value = 0.25;

    // Connect the nodes
    source.connect(compressor);
    compressor.connect(gainNode);

    // Create a new MediaStream with the processed audio track
    const destination = audioContext.createMediaStreamDestination();
    gainNode.connect(destination);

    // Combine the video and audio tracks
    this.stream = new MediaStream([
      ...videoStream.getVideoTracks(),
      ...destination.stream.getAudioTracks(),
    ]);

    // Show the stream inside our video object
    this.captureElement.nativeElement.srcObject = this.stream;
    this.captureElement.nativeElement.muted = true;
    await this.captureElement.nativeElement.play();
    this.isReady.set(true);
  }

  setDuration(index: number) {
    this.durationActive = this.durations[index];
  }

  // Change camera position
  changeCamera() {
    if (this.cameraPosition === 'user') {
      this.cameraPosition = 'environment';
    } else {
      this.stream.getTracks().forEach((track) =>
        track.applyConstraints({
          facingMode: [this.cameraPosition],
        })
      );
    }
  }

  async startRecord() {
    const options: MediaRecorderOptions = { mimeType: 'video/webm' };
    this.mediaRecorder = new MediaRecorder(this.stream, options);

    // Store chunks of recorded video
    const chunks = [];

    // Store the video on stop
    this.mediaRecorder.onstop = async (event) => {
      if (this.isCancelled) {
        return;
      }

      const videoBuffer = new Blob(chunks, { type: 'video/webm' });
      this.launchRecorderEvent.emit(videoBuffer);
      this.stream.getTracks().forEach((track) => track?.stop());
      this.changeDetector.detectChanges();
    };

    // Store chunks of recorded video
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    // Start recording
    this.mediaRecorder.start(100);
    this.isRecording.set(true);

    this.startProgress(this.durationActive);

    // Stop recording after duration, if not stopped manually
    this.durationId = setTimeout(() => {
      this.stopRecord();
    }, this.durationActive * 1000);
  }

  /**
   * Stop recording
   */
  stopRecord() {
    this.mediaRecorder?.stop();
    this.mediaRecorder = null;
    this.captureElement.nativeElement.src = null;
    this.isRecording.set(false);
    this.audioStream.getTracks().forEach((track) => track?.stop());
    this.stream.getTracks().forEach((track) => track?.stop());
  }

  startProgress(duration: number) {
    this.resetProgress();
    const intervalDuration = 100;
    const totalSteps = (duration * 1000) / intervalDuration;

    let currentStep = 0;

    this.intervalId = setInterval(() => {
      currentStep++;
      this.progress = currentStep / totalSteps;

      if (this.progress >= 1) {
        this.progress = 1;
        clearInterval(this.intervalId);
      }
    }, intervalDuration);
  }

  resetProgress() {
    this.progress = 0;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  ngOnDestroy() {
    this.resetProgress();
    clearTimeout(this.durationId);
  }

  /**
   * Close modal
   */
  closeModal() {
    this.isCancelled = true;
    this.stopRecord();
    this.modalController.dismiss(undefined, 'cancel');
  }
}
