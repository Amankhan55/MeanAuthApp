import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { from } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: String;
  username: String;
  email: String;
  password: String;

  constructor(
    private validateService: ValidateService,
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onRegisterSubmit() {
    const user = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password
    }

    //Required Field
    if(!this.validateService.validateRegister(user)) {
      this.flashMessage.show("Please fill in all fields", {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    //Email Validation
    if(!this.validateService.validateEmail(user.email)) {
      this.flashMessage.show("Please use a valid email", {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    //Regiser user
    this.authService.registerUser(user)
    .subscribe((data: any) => {
      if(data.success) {
        this.flashMessage.show("You are registered abd can log in", {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/login']);
      } else {
        if(data.msg == "Existing User!") {
          this.flashMessage.show("It's a registered user, try with diffrent username", {cssClass: 'alert-danger', timeout: 3000});
        } else {
          this.flashMessage.show("Something went wrong", {cssClass: 'alert-danger', timeout: 3000});
        }
        this.router.navigate(['/register']);
        this.onClearData();
      }
    });
  }

  onClearData() {
    this.name = "";
    this.username = "";
    this.email = "";
    this.password = "";
  }

}
