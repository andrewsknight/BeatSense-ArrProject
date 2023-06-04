import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcgDetailPage } from './ecg-detail.page';

describe('EcgDetailPage', () => {
  let component: EcgDetailPage;
  let fixture: ComponentFixture<EcgDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EcgDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
