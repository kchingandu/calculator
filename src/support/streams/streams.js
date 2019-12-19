import { fromEvent, merge, of } from 'rxjs';
import { getProcessingFunctionForKey, mapOperatorToDisplayMap } from '../utils/utils';
import { catchError, distinctUntilChanged, filter, map, pluck, repeat, scan } from 'rxjs/operators';

export const getOnClick$ = (_document = document) => fromEvent(_document, 'click')
  .pipe(
    filter(({target: {className}}) => className === 'calculator-button'),
    pluck('target', 'textContent')
  );

export const getOnKeyDown$ = (_document = document) => fromEvent(_document, 'keydown')
  .pipe(
    pluck('key'),
    filter(key => /[0-9\-*x+=/.]|Backspace|Enter|c/gi.test(key)),
    map(key => mapOperatorToDisplayMap(key)),
  );

export const getClickAndKeyDown$ = (_document = document) => (
  merge(
    getOnClick$(_document),
    getOnKeyDown$(_document)
  ).pipe(
    map(key => getProcessingFunctionForKey(key)),
    scan((acc, cur) => cur(acc), ''),
    catchError(() => of(`Bad Expression`)),
    distinctUntilChanged(),
    repeat()
  ));