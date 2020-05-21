import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
        // Callback of Hell
        document.addEventListener('click', evt => {
            console.log(evt);

            setTimeout(() => {
                console.log('timeout executed after 3s...');

                let counter = 0;

                setInterval(() => {
                    console.log(counter);
                    counter++;
                }, 1000);
            }, 3000);
        });
    }
}
