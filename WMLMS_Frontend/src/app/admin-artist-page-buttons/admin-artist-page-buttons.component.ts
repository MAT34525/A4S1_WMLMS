import {Component, inject} from '@angular/core';
import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {AdminServiceService} from '../admin-service.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';
import {MatCheckbox} from '@angular/material/checkbox';
import {Artists, Users} from '../schema';

@Component({
  selector: 'app-admin-artist-page-buttons',
  imports: [
    MatButton,
    MatSlideToggle
  ],
  standalone: true,
  templateUrl: './admin-artist-page-buttons.component.html',
  styleUrl: './admin-artist-page-buttons.component.css'
})
export class AdminArtistPageButtonsComponent implements ICellRendererAngularComp {

  public artist_id: string = '';
  is_verified : string = 'N';
  artist : Artists | undefined = undefined;
  toogleLockValue : string = "";
  toogleLockStatus : boolean = false;

  params : ICellRendererParams | undefined;

  adminService = inject(AdminServiceService);

  constructor( private route : Router ) {
  }
  // gets called once before the renderer is used
  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.artist_id = params.data.ARTIST_ID;

    this.adminService.getArtist(this.artist_id).subscribe(data =>
      {
        console.log('Artist loaded : ', data);
        this.artist = data;
      }
    );

    this.is_verified = params.data.IS_VERIFIED;

    this.updateLock();
  }

  refresh(params: ICellRendererParams) {
    return true;
  }

  updateLock() {
    if(this.is_verified === 'Y') {
      this.toogleLockValue = "Verified";
      this.toogleLockStatus = true;
    } else {
      this.toogleLockValue = "";
      this.toogleLockStatus = false;
    }
  }

  onToogleLockClick()
  {
    this.is_verified = (this.is_verified === 'N')? "Y": "N" ;

    this.updateLock();

    console.log(this.is_verified)

    console.log("Admin user lock toogle triggered for artist  : ", this.artist_id);

    if(this.artist){
      this.adminService.toogleArtistVerification(this.artist_id, this.artist)
        .subscribe(artists => this.artist);
    }
  }

  onViewClick()
  {
    console.log("Admin user view triggered for artist : ", this.artist_id);
    this.route.navigate(['/a/users/view', this.artist_id]);
  }

  onEditClick()
  {
    console.log("Admin user edit triggered for artist : ", this.artist_id);
    this.route.navigate(['/a/users/edit', this.artist_id]);
  }

}
