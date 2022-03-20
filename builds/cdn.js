import TimeAgo from '../src/index.js';

document.addEventListener('alpine:init', () => {
    TimeAgo(window.Alpine);
});
