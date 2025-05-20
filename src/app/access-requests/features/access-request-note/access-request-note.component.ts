/**
 * This component displays a note for an access request.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, computed, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  AccessRequest,
  NotesTypeSelection,
} from '@app/access-requests/models/access-requests';
import {
  EditActionType,
  EditDictionary,
} from '../access-request-manager-dialog/access-request-manager-dialog.component';

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
  @Input() handleEdit!: (
    action: EditActionType,
    editDictionary: EditDictionary,
  ) => void;

  editNoteToRequester: EditDictionary = {
    name: 'note_to_requester',
    show: false,
    editedValue: null,
  };
  editInternalNote: EditDictionary = {
    name: 'internal_note',
    show: false,
    editedValue: null,
  };

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
}
