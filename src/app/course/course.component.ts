import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import { debounceTime, distinctUntilChanged, first, map, startWith, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { forkJoin, fromEvent, Observable } from 'rxjs';
import { Lesson } from '../model/lesson';
import { createHttpObservable } from '../common/util';
import { debug, RxJsLoggingLevel, setRxJsLoggingLevel } from '../common/debug';
import { Store } from '../common/store.service';

@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {
    courseId: number;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;

    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(
        private route: ActivatedRoute,
        private store: Store
    ) {
    }

    ngOnInit() {
        this.courseId = this.route.snapshot.params['id'];
        this.course$ = this.store.selectCourseById(this.courseId);

        this.loadLessons()
            .pipe(
                withLatestFrom(this.course$)
            )
            .subscribe(([lessons, course]) => {
                console.log(course);
                console.log(lessons);
            });
    }

    ngAfterViewInit() {
        this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
            .pipe(
                map(event => event.target.value),
                startWith(''),
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(search => this.loadLessons(search)),
            );
    }

    loadLessons(search = ''): Observable<Lesson[]> {
        return createHttpObservable(`/api/lessons?courseId=${ this.courseId }&pageSize=100&filter=${ search }`)
            .pipe(
                map(res => res['payload'])
            );
    }
}
