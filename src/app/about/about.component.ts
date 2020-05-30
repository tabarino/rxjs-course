import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
    AsyncSubject,
    BehaviorSubject,
    concat,
    fromEvent,
    interval,
    merge,
    noop,
    Observable,
    of,
    ReplaySubject,
    Subject,
    timer
} from 'rxjs';
import { createHttpObservable } from '../common/util';
import { map } from 'rxjs/operators';

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
    constructor() {
    }

    ngOnInit() {
        // const subject = new AsyncSubject();
        const subject = new ReplaySubject();
        const series$ = subject.asObservable();

        series$.subscribe(val => console.log('first subscription: ', val));

        subject.next(1);
        subject.next(2);
        subject.next(3);

        subject.complete();

        setTimeout(() => {
            series$.subscribe(val => console.log('second subscription: ', val));
            subject.next(4);
        });
    }
}
