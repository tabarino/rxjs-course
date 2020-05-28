import { Observable } from 'rxjs';
import { Course } from '../model/course';

export function createHttpObservable(url: string) {
    return new Observable<Course[]>(observer => {
        const controller = new AbortController();
        const signal = controller.signal;

        fetch(url, { signal })
            .then(response => {
                return response.json();
            })
            .then(body => {
                observer.next(body);
                observer.complete();
            })
            .catch(err => {
                observer.error(err);
            });

        return () => controller.abort();
    });
}
