/**
 * This component displays a note for an access request.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AccessRequest } from '@app/access-requests/models/access-requests';
import { AccessRequestFieldEditService } from '@app/access-requests/services/access-request-field-edit.service';
import { EditableFieldInfo } from '../access-request-manager-dialog/access-request-manager-dialog.component';

/**
 * This is a so-called "dumb" component that displays a note for an access request.
 */
@Component({
  selector: 'app-access-request-notes',
  imports: [MatChipsModule, MatIconModule, MatInputModule, FormsModule],
  templateUrl: './access-request-notes-edit.component.html',
  styleUrl:
    '../access-request-manager-dialog/access-request-manager-dialog.component.scss',
})
export class AccessRequestNotesEditComponent {
  request = input.required<AccessRequest>();
  editNoteToRequester = input.required<EditableFieldInfo>();
  editInternalNote = input.required<EditableFieldInfo>();

  editNotesAndTicket = inject(AccessRequestFieldEditService);
}
