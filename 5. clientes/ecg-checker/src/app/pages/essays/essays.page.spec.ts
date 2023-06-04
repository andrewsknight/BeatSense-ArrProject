import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EssaysPage } from './essays.page';

describe('EssaysPage', () => {
  let component: EssaysPage;
  let fixture: ComponentFixture<EssaysPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EssaysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
