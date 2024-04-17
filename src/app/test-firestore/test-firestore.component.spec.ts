import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFirestoreComponent } from './test-firestore.component';

describe('TestFirestoreComponent', () => {
  let component: TestFirestoreComponent;
  let fixture: ComponentFixture<TestFirestoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestFirestoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestFirestoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
