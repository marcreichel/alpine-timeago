import TimeAgo from '../src/index';

document.addEventListener('alpine:init', (): void => {
    TimeAgo((<any>window).Alpine);
});
