import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { concat, fromEvent, interval, merge, noop, Observable, of, Subject, timer } from 'rxjs';
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
        const subject = new Subject();
        const series$ = subject.asObservable();

        series$.subscribe(console.log);

        subject.next(1);
        subject.next(2);
        subject.next(3);

        subject.complete();
    }
}
