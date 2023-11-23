import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NavComponent } from './nav.component';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  const mockedAuthService = jasmine.createSpyObj(
    'AuthService',
    ['createUser', 'logout'],
    {
      isAuthenticated$: of(true),
    }
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useValue: mockedAuthService }],
    });
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log out', () => {
    const logoutLink = fixture.debugElement.query(By.css('li:nth-child(3) a'));
    expect(logoutLink).withContext('Not logged in').toBeTruthy();

    logoutLink.triggerEventHandler('click');
    expect(mockedAuthService.logout)
      .withContext('Could not click logout link')
      .toHaveBeenCalledTimes(1);
  });
});
