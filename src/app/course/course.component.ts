import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { fromEvent, Observable } from 'rxjs';
import { Lesson } from '../model/lesson';
import { createHttpObservable } from '../common/util';
import { debug, RxJsLoggingLevel, setRxJsLoggingLevel } from '../common/debug';

@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {
    courseId: string;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;

    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.courseId = this.route.snapshot.params['id'];
        this.course$ = createHttpObservable(`/api/courses/${ this.courseId }`)
            .pipe(
                // Instead of using tap to log our messages we can create a custom rxjs operator
                // tap(course => console.log('course: ', course))
                debug(RxJsLoggingLevel.INFO, 'course'),
            );
    }

    ngAfterViewInit() {
        // You can change the Logging Level with this function when you are debugging
        setRxJsLoggingLevel(RxJsLoggingLevel.DEBUG);

        this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
            .pipe(
                map(event => event.target.value),
                startWith(''),
                // Instead of using tap to log our messages we can create a custom rxjs operator
                // tap(search => console.log('search: ', search)),
                debug(RxJsLoggingLevel.TRACE, 'search'),
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(search => this.loadLessons(search)),
                debug(RxJsLoggingLevel.DEBUG, 'lessons'),
            );
    }

    loadLessons(search = ''): Observable<Lesson[]> {
        return createHttpObservable(`/api/lessons?courseId=${ this.courseId }&pageSize=100&filter=${ search }`)
            .pipe(
                map(res => res['payload'])
            );
    }
}
