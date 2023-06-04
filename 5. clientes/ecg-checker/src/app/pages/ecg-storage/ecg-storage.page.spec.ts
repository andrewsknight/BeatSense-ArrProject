import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcgStoragePage } from './ecg-storage.page';

describe('EcgStoragePage', () => {
  let component: EcgStoragePage;
  let fixture: ComponentFixture<EcgStoragePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EcgStoragePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
