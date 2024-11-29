import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appScrollNearEnd]',
  standalone: true,
})
export class ScrollNearEndDirective {
  @Input() threshold = 120;

  @Output() nearEnd: EventEmitter<void> = new EventEmitter<void>();

  private window!: Window;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // save window object for type safety
    this.window = window;
  }

  @HostListener('window:scroll', ['$event.target'])
  windowScrollEvent(event: KeyboardEvent) {
    // height of whole window page
    const heightOfWholePage = this.window.document.documentElement.scrollHeight;
    console.log({ heightOfWholePage });

    // how big in pixels the element is
    const heightOfElement = this.el.nativeElement.scrollHeight;
    console.log(
      '🚀 ~ ScrollNearEndDirective ~ windowScrollEvent ~ heightOfElement:',
      heightOfElement
    );

    // currently scrolled Y position
    const currentScrolledY = this.window.scrollY;
    console.log(
      '🚀 ~ ScrollNearEndDirective ~ windowScrollEvent ~ currentScrolledY:',
      currentScrolledY
    );

    // height of opened window - shrinks if console is opened
    const innerHeight = this.window.innerHeight;
    console.log(
      '🚀 ~ ScrollNearEndDirective ~ windowScrollEvent ~ innerHeight:',
      innerHeight
    );

    /**
     * the area between the start of the page and when this element is visible
     * in the parent component
     */
    const spaceOfElementAndPage = heightOfWholePage - heightOfElement;

    // calculated whether we are near the end
    const scrollToBottom =
      heightOfElement - innerHeight - currentScrolledY + spaceOfElementAndPage;

    console.log({ scrollToBottom });

    // if the user is near end
    if (scrollToBottom < this.threshold) {
      console.log(
        '%c [ScrollNearEndDirective]: emit',
        'color: #bada55; font-size: 20px'
      );
      this.nearEnd.emit();
    }
  }
}
