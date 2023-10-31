import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './_services/authentication.service';
import { AlertService } from './_services/alert.service';
@Component({
selector: 'app-root',
templateUrl: './app.component.html',
styleUrls: ['./app.component.scss']
})
export class AppComponent {
currentUser: {
email: string,
name: string,
token: string,
isAdmin: boolean
};
title = 'Quoteboard';
constructor(
private router: Router,
private authenticationService: AuthenticationService,
private alertService: AlertService
) {
this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
}
logout(event): void {
this.authenticationService.logout();
this.router.navigate(['/login']);
event.preventDefault();
}
}
