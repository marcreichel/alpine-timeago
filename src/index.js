import { differenceInSeconds, formatDistanceToNow, parseISO } from 'date-fns';

let locale = null;

function TimeAgo(Alpine) {
    Alpine.directive('timeago', (el, { expression, modifiers }, { evaluateLater, effect, cleanup }) => {
        let evaluateDate = evaluateLater(expression);

        const render = (date) => {
            try {
                el.textContent = formatDistanceToNow(date, {
                    addSuffix: !modifiers.includes('pure'),
                    includeSeconds: modifiers.includes('seconds'),
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

                if (typeof date === 'string') {
                    date = parseISO(date);
                }

                render(date);

                let intervalDuration = 30000;
                if (modifiers.includes('seconds')) {
                    intervalDuration = 5000;
                }

                interval = setInterval(() => {
                    render(date);
                }, intervalDuration);
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
