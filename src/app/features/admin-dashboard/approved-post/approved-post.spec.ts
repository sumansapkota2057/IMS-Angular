import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedPost } from './approved-post';

describe('ApprovedPost', () => {
  let component: ApprovedPost;
  let fixture: ComponentFixture<ApprovedPost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedPost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedPost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
