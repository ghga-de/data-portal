/**
 * This component displays a note for an access request.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, computed, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  AccessRequest,
  NotesTypeSelection,
} from '@app/access-requests/models/access-requests';
import { AccessRequestService } from '@app/access-requests/services/access-request.service';

/**
 * This is a so-called "dumb" component that displays a note for an access request.
 */
@Component({
  selector: 'app-access-request-note',
  imports: [MatChipsModule, MatIconModule, MatInputModule, FormsModule],
  templateUrl: './access-request-note.component.html',
  styleUrl:
    '../access-request-manager-dialog/access-request-manager-dialog.component.scss',
})
export class AccessRequestNoteComponent {
  @Input() request!: AccessRequest;
  @Input() noteTypes!: NotesTypeSelection;
  @Input() showAsTable: boolean = false;

  #accessRequestService = inject(AccessRequestService);

  showEditNoteToRequester = false;
  showEditInternalNote = false;

  editedNoteToRequester: string | null = null;
  editedInternalNote: string | null = null;

  showInternalNote = computed(() => {
    return (
      this.request.internal_note &&
      (this.noteTypes == NotesTypeSelection.internalNote ||
        this.noteTypes == NotesTypeSelection.both)
    );
  });

  showNoteToRequester = computed(() => {
    return (
      this.request.note_to_requester &&
      (this.noteTypes == NotesTypeSelection.noteToRequester ||
        this.noteTypes == NotesTypeSelection.both)
    );
  });

  /**
   * Handle all the processes needed for the handling of the editing of the ticket id
   * @param action the action that we are currently doing (show the edit field, cancel edit, or save the edit)
   */
  handleEditNoteToRequester(action: string) {
    switch (action) {
      case 'show':
        this.showEditNoteToRequester = true;
        this.editedNoteToRequester = this.request.note_to_requester;
        break;

      case 'cancel':
        this.showEditNoteToRequester = false;
        this.editedNoteToRequester = this.request.note_to_requester;
        break;

      case 'save':
        this.showEditNoteToRequester = false;
        this.request.note_to_requester = this.editedNoteToRequester;
        this.#accessRequestService.processRequest(this.request.id, {
          note_to_requester: this.editedNoteToRequester,
        });
        this.editedNoteToRequester = null;
        break;

      default:
        break;
    }
  }

  /**
   * Handle all the processes needed for the handling of the editing of the ticket id
   * @param action the action that we are currently doing (show the edit field, cancel edit, or save the edit)
   */
  handleEditInternalNote(action: string) {
    switch (action) {
      case 'show':
        this.showEditInternalNote = true;
        this.editedInternalNote = this.request.internal_note;
        break;

      case 'cancel':
        this.showEditInternalNote = false;
        this.editedInternalNote = this.request.internal_note;
        break;

      case 'save':
        this.showEditInternalNote = false;
        this.request.internal_note = this.editedInternalNote;
        this.#accessRequestService.processRequest(this.request.id, {
          internal_note: this.editedInternalNote,
        });
        this.editedInternalNote = null;
        break;

      default:
        break;
    }
  }
}
