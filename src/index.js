import {formatDistanceToNow, formatDistanceToNowStrict, parseISO} from 'date-fns';

let locale = null;

function TimeAgo(Alpine) {
    Alpine.directive('timeago', (el, { expression, modifiers }, { evaluateLater, effect, cleanup }) => {
        let evaluateDate = evaluateLater(expression);

        const render = (date) => {
            try {
                if (modifiers.includes('strict')) {
                    let unit = modifiers.includes('unit') ? modifiers[modifiers.findIndex((modifier) => modifier === 'unit') + 1] || undefined : undefined;
                    if (!['second', 'minute', 'hour', 'day', 'month', 'year'].includes(unit)) {
                       unit = undefined;
                    }
                    let roundingMethod = modifiers.includes('rounding') ? modifiers[modifiers.findIndex((modifier) => modifier === 'rounding') + 1] || undefined : undefined;
                    if (!['floor', 'ceil', 'round'].includes(roundingMethod)) {
                        roundingMethod = undefined;
                    }
                    el.textContent = formatDistanceToNowStrict(date, {
                        addSuffix: !modifiers.includes('pure'),
                        unit,
                        roundingMethod,
                        locale,
                    });
                } else {
                    el.textContent = formatDistanceToNow(date, {
                        addSuffix: !modifiers.includes('pure'),
                        includeSeconds: modifiers.includes('seconds'),
                        locale,
                    });
                }
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

    Alpine.magic('timeago', () => (expression, pure, seconds, strictOptions) => {
        if (pure == null) {
            pure = false;
        }
        if (seconds == null) {
            seconds = false;
        }
        if (strictOptions != null && (strictOptions['strict'] || undefined)) {
            return formatDistanceToNowStrict(expression, {
                addSuffix: !pure,
                unit: strictOptions['unit'] || undefined,
                roundingMethod: strictOptions['roundingMethod'] || undefined,
                locale,
            })
        }
        return formatDistanceToNow(expression, {
            addSuffix: !pure,
            includeSeconds: seconds,
            locale,
        })
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
