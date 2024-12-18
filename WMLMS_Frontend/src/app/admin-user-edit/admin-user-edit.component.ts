import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Users} from '../schema';
import {AdminServiceService} from '../admin-service.service';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-user-edit',
  imports: [
    RouterLink,
    MatButton,
    NgIf,
    FormsModule,
    NgbTooltip,
    ReactiveFormsModule
  ],
  templateUrl: './admin-user-edit.component.html',
  standalone: true,
  styleUrl: './admin-user-edit.component.css'
})
export class AdminUserEditComponent {

  user_id : string ='';
  userItem : Users | undefined;
  adminService=inject(AdminServiceService);
  userForm: FormGroup;
  formsBuilder : FormBuilder;

  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private route: Router) {
    this.user_id = activatedRoute.snapshot.params['id'];
    this.userItem = undefined;
    this.formsBuilder = formBuilder;

    this.userForm = this.formBuilder.group({
      USERNAME: new FormControl<string>('', Validators.required),
      EMAIL: new FormControl<string>(''),
      FULL_NAME: new FormControl<string>(''),
    });
  }
  ngOnInit() {
    this.getUser(this.user_id);
  }

  getUser(userID : string)  {

    if(/^[abcdef0-9\-]*$/.test(userID)) { // Avoid SQL injection using user ID
       this.adminService.getUser(userID).subscribe({
        next: data => {
          this.userItem = data;
          console.log('GET /admin/user/:id', data);
        }, error:err=> {
          console.log("Failed to load User");
        }
      });
    }
    else {
      console.warn("User ID was not numeric !");
    }
  }

  onAdd() {

    if (this.userForm.valid && this.userItem)
    {
      const formData = this.userForm.value;
      console.log('Form data submitted:', formData);

      this.adminService.putUser(this.user_id, formData)
        .subscribe(users => formData);

      this.route.navigate(['/a/users']);
    }
    else {
      console.log('Form is invalid. Please check the required fields.');
    }
  }

}
