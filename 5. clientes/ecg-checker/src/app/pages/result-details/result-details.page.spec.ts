import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultDetailsPage } from './result-details.page';

describe('ResultDetailsPage', () => {
  let component: ResultDetailsPage;
  let fixture: ComponentFixture<ResultDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ResultDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
