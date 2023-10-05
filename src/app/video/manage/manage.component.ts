import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';

enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  videoOrder = SortOrder.DESC;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(map((params) => params['sort']))
      .subscribe(
        (sortOrder) =>
          (this.videoOrder =
            sortOrder === SortOrder.ASC ? sortOrder : SortOrder.DESC)
      );
  }

  sort(event: Event) {
    const { value } = event.target as HTMLSelectElement;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
      },
    });
  }
}
