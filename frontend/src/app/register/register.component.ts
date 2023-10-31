import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';
import { UserService } from '../_services/user.service';
import { AlertService } from '../_services/alert.service';
function passwordMatchValidator(group: FormGroup): any {
if (group) {
if (group.get('password').value !== group.get('passwordConfirmation').value) {
return { notMatching : true };
}
}
return null;
}
@Component({
selector: 'app-register',
templateUrl: './register.component.html',
styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
registerForm: FormGroup;
loading = false;
submitted = false;
constructor(
private formBuilder: FormBuilder,
public router: Router,
private authenticationService: AuthenticationService,
private userService: UserService,
public alertService: AlertService
) {
// redirect to home if already logged in
if (this.authenticationService.currentUserValue) {
this.router.navigate(['/']);
}
}
ngOnInit() {
this.registerForm = this.formBuilder.group({
name: ['', Validators.required],
email: ['', Validators.required],
password: ['', [Validators.required, Validators.minLength(6)]],
passwordConfirmation: ['', [Validators.required]]
});
this.registerForm.setValidators(passwordMatchValidator);
}
// convenience getter for easy access to form fields
get f() { return this.registerForm.controls; }
onSubmit() {
this.submitted = true;
8// stop here if form is invalid
if (this.registerForm.invalid) {
return;
}
this.loading = true;
this.userService.register(this.registerForm.value)
.pipe(first())
.subscribe(
data => {
this.alertService.success('Registration successful', true);
this.router.navigate(['/login']);
},
error => {
this.alertService.error('Error contacting server: ' + error.message);
this.loading = false;
});
}
}