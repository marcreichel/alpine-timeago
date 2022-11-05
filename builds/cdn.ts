import TimeAgo from '../src/index.js';

document.addEventListener('alpine:init', (): void => {
    TimeAgo((<any>window).Alpine);
});
