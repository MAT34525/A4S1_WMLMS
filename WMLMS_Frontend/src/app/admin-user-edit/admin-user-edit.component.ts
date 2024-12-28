// Angular
import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

// Project
import {Users} from '../schema';
import {AdminService} from '../admin-service.service';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-user-edit',
  imports: [
    RouterLink,
    MatButton,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltip,
  ],
  templateUrl: './admin-user-edit.component.html',
  standalone: true,
  styleUrl: './admin-user-edit.component.css'
})
export class AdminUserEditComponent {

  private readonly adminService = inject(AdminService);

  // Page components
  user_id : string ='';
  userItem : Users | undefined;

  // Forms
  userForm: FormGroup;
  formsBuilder : FormBuilder;

  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private route: Router) {

    this.user_id = activatedRoute.snapshot.params['id'];
    this.userItem = undefined;

    // Build the forms
    this.formsBuilder = formBuilder;
    this.userForm = this.formBuilder.group({
      USERNAME: new FormControl<string>('', Validators.required),
      EMAIL: new FormControl<string>(''),
      FULL_NAME: new FormControl<string>(''),
    });
  }

  ngOnInit() {
    // Load additional user data at component init
    this.getUser(this.user_id);
  }

  // Get user data from backend
  getUser(userID : string)  {

    // Verify SQL injection
    if(/^[abcdef0-9\-]*$/.test(userID)) {

      // Load user data using user id
       this.adminService.getUser(userID).subscribe({
        next: data => {
          this.userItem = data;
        }, error:err=> {
          console.log("Failed to load User : ", err);
        }
      });
    }
    else {
      console.warn("User ID was not valid !");
    }
  }

  // Update the user values
  onAdd() {

    // Validate the forms
    if (this.userForm.valid && this.userItem)
    {
      const formData = this.userForm.value;
      console.log('User updated :', formData);

      // Update user
      this.adminService.putUser(this.user_id, formData)
        .subscribe(users => formData);

      // Return to the user list page
      this.route.navigate(['/a/users']);
    }
    else {
      console.log('Form is invalid. Please check the required fields.');
    }
  }
}
