import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { map, share } from 'rxjs/operators';

@Component({
  selector: 'app-display-time',
  standalone: true,
  imports: [],
  templateUrl: './display-time.component.html',
  styleUrls: ['./display-time.component.css'],
})
export class DisplayTimeComponent implements OnInit, OnDestroy {
  time: string = '';
  rxTime: string = '';
  intervalId: any;
  subscription: Subscription | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Using Basic Interval
      this.intervalId = setInterval(() => {
        this.time = new Date().toLocaleTimeString('en-US', { hour12: true });
      }, 1000);

      // Using RxJS Timer
      this.subscription = timer(0, 1000)
        .pipe(
          map(() => new Date().toLocaleTimeString('en-US', { hour12: true })),
          share()
        )
        .subscribe((formattedTime) => {
          this.rxTime = formattedTime;
        });
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      clearInterval(this.intervalId);
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  }
}
