import { Directive, Renderer2, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appBodyClass]',
  standalone: true
})
export class BodyClassDirective implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const authSubscription = this.authService.authState$.subscribe(isLoggedIn => {
      this.updateClasses(isLoggedIn, this.router.url);
    });

    const routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const isLoggedIn = this.authService.isLoggedIn();
        this.updateClasses(isLoggedIn, event.urlAfterRedirects);
      }
    });

    this.subscriptions.add(authSubscription);
    this.subscriptions.add(routerSubscription);
  }

  private updateClasses(isLoggedIn: boolean, currentUrl: string): void {
    if (isLoggedIn && !currentUrl.includes('first-access')) {
      this.renderer.addClass(this.el.nativeElement, 'logged-in');
      this.renderer.removeClass(this.el.nativeElement, 'not-logged-in');
    } else {
      this.renderer.addClass(this.el.nativeElement, 'not-logged-in');
      this.renderer.removeClass(this.el.nativeElement, 'logged-in');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
