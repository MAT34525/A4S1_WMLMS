// Angular
import {Component, inject} from '@angular/core';
import {MatSlideToggle} from '@angular/material/slide-toggle';

// AG Grid
import type {ICellRendererAngularComp} from 'ag-grid-angular';
import type {ICellRendererParams} from 'ag-grid-community';

// Project
import {AdminService} from '../admin-service.service';
import {Artists} from '../schema';

@Component({
  selector: 'app-admin-artist-page-buttons',
  imports: [
    MatSlideToggle
  ],
  standalone: true,
  templateUrl: './admin-artist-page-buttons.component.html',
  styleUrl: './admin-artist-page-buttons.component.css'
})
export class AdminArtistPageButtonsComponent implements ICellRendererAngularComp {

  adminService = inject(AdminService);

  // Angular component
  params : ICellRendererParams | undefined;

  // Private elements
  private artist_id: string = "";
  private is_verified : string = "N";
  private artist : Artists | undefined = undefined;

  // Toggle button
  toggleVerificationValue : string = "";
  toggleVerificationStatus : boolean = false;

  // Prepare values at init
  agInit(params: ICellRendererParams): void {

    this.params = params;

    this.artist_id = params.data.ARTIST_ID;
    this.is_verified = params.data.IS_VERIFIED;

    // Get additional values of the selected artist
    this.adminService.getArtist(this.artist_id).subscribe(data => this.artist = data);

    // Update messages using toggle status
    this.updateLock();
  }

  // Cell refresh
  refresh(params: ICellRendererParams) {
    return true;
  }

  // Toggle values update
  updateLock() {
    if(this.is_verified === 'Y') {
      this.toggleVerificationValue = "Verified";
      this.toggleVerificationStatus = true;
    } else {
      this.toggleVerificationValue = "";
      this.toggleVerificationStatus = false;
    }
  }

  // Actions to run when toggling the verification button
  onToggleVerificationClick()
  {
    console.log("Admin artist verification toggle triggered for : ", this.artist_id);

    // Invert the verification status
    this.is_verified = (this.is_verified === 'N')? "Y": "N" ;

    // Update toggle value
    this.updateLock();

    // Update the new artist status in the database
    if(this.artist){
      this.adminService.toggleArtistVerification(this.artist_id, this.artist)
        .subscribe(artists => this.artist = artists);
    }
  }
}
