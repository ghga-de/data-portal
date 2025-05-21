/**
 * This component displays a note for an access request.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  AccessRequest,
  NotesTypeSelection,
} from '@app/access-requests/models/access-requests';
import { ParseTicketIdPipe } from '@app/access-requests/pipes/parse-ticket-id.pipe';
import { AccessRequestFieldEditService } from '@app/access-requests/services/access-request-field-edit.service';
import { AccessRequestService } from '@app/access-requests/services/access-request.service';
import { EditDictionary } from '../access-request-manager-dialog/access-request-manager-dialog.component';

/**
 * This is a so-called "dumb" component that displays a note for an access request.
 */
@Component({
  selector: 'app-access-request-note',
  imports: [MatChipsModule, MatIconModule, MatInputModule, FormsModule],
  providers: [ParseTicketIdPipe],
  templateUrl: './access-request-note.component.html',
  styleUrl:
    '../access-request-manager-dialog/access-request-manager-dialog.component.scss',
})
export class AccessRequestNoteComponent {
  request = input.required<AccessRequest>();
  noteTypes = input.required<NotesTypeSelection>();
  showAsTable = input<boolean>(false);
  editNoteToRequester = input<EditDictionary>();
  editInternalNote = input<EditDictionary>();

  editNotesAndTicket = inject(AccessRequestFieldEditService);

  arService = inject(AccessRequestService);
  parseTicketId = inject(ParseTicketIdPipe);

  showInternalNote = computed(() => {
    return (
      this.request().internal_note &&
      (this.noteTypes() == NotesTypeSelection.internalNote ||
        this.noteTypes() == NotesTypeSelection.both)
    );
  });

  showNoteToRequester = computed(() => {
    return (
      this.request().note_to_requester &&
      (this.noteTypes() == NotesTypeSelection.noteToRequester ||
        this.noteTypes() == NotesTypeSelection.both)
    );
  });
}
