import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainClipPage } from './main-clip.page';

describe('MainClipPage', () => {
  let component: MainClipPage;
  let fixture: ComponentFixture<MainClipPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MainClipPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
