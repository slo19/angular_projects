import { Component, OnInit, inject } from '@angular/core';
import { ScullyRoute, ScullyRoutesService } from '@scullyio/ng-lib';
import { Observable, map } from 'rxjs';
@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent implements OnInit {
  contructor() {  }
  posts$: Observable<ScullyRoute[]> | undefined;

  public scullyService = inject(ScullyRoutesService);
  ngOnInit(): void {
    this.posts$ = this.scullyService.available$.pipe(
      map((posts: any) => posts.filter((post: any) => post.title))
    );
  }
}
