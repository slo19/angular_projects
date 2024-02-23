import { Component, EventEmitter, inject, Output, } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Issue } from '../issue';
import { IssuesService } from '../issues.service';

interface IssueForm {
  title: FormControl<string>;
  description: FormControl<string>;
  priority: FormControl<string>;
  type: FormControl<string>;
}
@Component({
  selector: 'app-issue-report',
  templateUrl: './issue-report.component.html',
  styleUrls: ['./issue-report.component.css']
})
export class IssueReportComponent {
  @Output() formClose = new EventEmitter();

  private readonly issuesService = inject(IssuesService);
  
  issueForm = new FormGroup<IssueForm>({
    title: new FormControl('', { nonNullable: true}),
    description: new FormControl('', { nonNullable: true}),
    priority: new FormControl('', { nonNullable: true }),
    type: new FormControl('', { nonNullable: true})
  });

  addIssue() {
    this.issuesService.createIssue(this.issueForm.getRawValue() as Issue);
    this.formClose.emit();
  }
}
