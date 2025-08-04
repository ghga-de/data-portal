/**
 * Component for data stewards to see details of an access grant.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';

/**
 * Access Grant Manager Details component.
 *
 * This component is used to show details of an access grant.
 */
@Component({
  selector: 'app-access-grant-manager-details',
  imports: [
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './access-grant-manager-details.component.html',
  styleUrl: './access-grant-manager-details.component.scss',
})
export class AccessGrantManagerDetailsComponent implements OnInit {
  id: string | null = null;
  route = inject(ActivatedRoute);

  /**
   * On Init, determine the access grant ID from the route parameters.
   */
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
  }
}
