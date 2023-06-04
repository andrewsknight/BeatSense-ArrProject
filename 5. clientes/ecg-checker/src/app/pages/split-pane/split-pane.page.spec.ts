import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SplitPanePage } from './split-pane.page';

describe('SplitPanePage', () => {
  let component: SplitPanePage;
  let fixture: ComponentFixture<SplitPanePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SplitPanePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
