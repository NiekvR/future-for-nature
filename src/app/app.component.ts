import { AfterViewInit, Component } from '@angular/core';
import { ShepherdService } from 'angular-shepherd';
import { UserService } from '@app/core/user.service';
import { filter, take, tap } from 'rxjs';
import { TOUR_STEPS } from '@app/tour-steps';

@Component({
  selector: 'ffn-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  private steps = TOUR_STEPS;

  constructor(private shepherdService: ShepherdService, private userService: UserService) {
  }

  ngAfterViewInit() {
    this.userService.getMySelf()
      .pipe(
        take(1),
        filter(user => !user.intro),
        tap(() => this.startTour()))
      .subscribe(appUser => {
        appUser.intro = true;
        this.userService.update(appUser).subscribe();
      })
  }

  private startTour() {
    this.shepherdService.defaultStepOptions = {
      classes: 'shepherd-ffn-theme'
    };
    this.shepherdService.modal = true;
    this.shepherdService.confirmCancel = true;
    // @ts-ignore
    this.shepherdService.addSteps(this.steps);
    this.shepherdService.start();
  }
}
