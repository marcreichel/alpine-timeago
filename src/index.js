import { formatDistanceToNow, parseISO } from 'date-fns';

let locale = null;

function TimeAgo(Alpine) {
    Alpine.directive('timeago', (el, { expression }, { evaluateLater, effect, cleanup }) => {
        let evaluateDate = evaluateLater(expression);

        const render = (date) => {
            try {
                if (typeof date === 'string') {
                    date = parseISO(date);
                }
                el.textContent = formatDistanceToNow(date, {
                    addSuffix: true,
                    locale,
                });
            } catch (e) {
                console.error(e);
            }
        }

        let interval;

        effect(() => {
            evaluateDate((date) => {
                if (interval) {
                    clearInterval(interval);
                }

                render(date);

                interval = setInterval(() => {
                    render(date);
                }, 30000);
            });
        });

        cleanup(() => clearInterval(interval));
    });
}

TimeAgo.configure = (config) => {
    if (config.hasOwnProperty('locale') && typeof config.locale === 'object') {
        if (config.locale.hasOwnProperty('formatDistance')) {
            locale = config.locale;
        }
    }

    return TimeAgo;
}

export default TimeAgo;
