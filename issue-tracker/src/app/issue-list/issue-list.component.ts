import { Component, OnInit, inject } from '@angular/core';
import { Issue } from '../issue';
import { IssuesService } from '../issues.service';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrl: './issue-list.component.css'
})
export class IssueListComponent implements OnInit {
  private readonly issuesService = inject(IssuesService);

  issues: Issue[] = [];
  constructor() {}
  ngOnInit(): void {
    this.getIssues();
  }
  private getIssues() {
    this.issues = this.issuesService.getPendingIssues();
  }
}
