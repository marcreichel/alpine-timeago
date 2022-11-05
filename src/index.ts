import { Alpine } from 'alpinejs';
import { formatDistanceToNow, formatDistanceToNowStrict, Locale, parseISO } from 'date-fns';

let locale: Locale = null;

function TimeAgo(Alpine: Alpine): void {
    Alpine.directive('timeago', (el: Node, { expression, modifiers }, { evaluateLater, effect, cleanup }: { evaluateLater: (expression: string) => (callback: (value: unknown) => void) => void, effect: (callback: Function) => void, cleanup: (callback: Function) => void }) => {
        let evaluateDate: (callback: (value: unknown) => void) => void = evaluateLater(expression);

        const render: (date: number | Date) => void = (date: number | Date): void => {
            try {
                if (modifiers.includes('strict')) {
                    let unit: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year';
                    if (modifiers.includes('unit')) {
                        const innerUnit: string = modifiers[modifiers.findIndex((modifier: string) => modifier === 'unit') + 1] || undefined;
                        switch (innerUnit) {
                            case 'second':
                                unit = 'second';
                                break;
                            case 'minute':
                                unit = 'minute';
                                break;
                            case 'hour':
                                unit = 'hour';
                                break;
                            case 'day':
                                unit = 'day';
                                break;
                            case 'month':
                                unit = 'month';
                                break;
                            case 'year':
                                unit = 'year';
                                break;
                            default:
                                unit = undefined;
                                break;
                        }
                    }
                    let roundingMethod: 'floor' | 'ceil' | 'round';
                    if (modifiers.includes('rounding')) {
                        const innerRounding: string = modifiers[modifiers.findIndex((modifier: string) => modifier === 'rounding') + 1] || undefined;
                        switch (innerRounding) {
                            case 'floor':
                                roundingMethod = 'floor';
                                break;
                            case 'ceil':
                                roundingMethod = 'ceil';
                                break;
                            case 'round':
                                roundingMethod = 'round';
                                break;
                            default:
                                roundingMethod = undefined;
                                break;
                        }
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
            } catch (e: unknown) {
                console.error(e);
            }
        }

        let interval: ReturnType<typeof setInterval> | undefined;

        effect((): void => {
            evaluateDate((date: string | Date) => {
                if (interval) {
                    clearInterval(interval);
                }

                let parsedDate: Date;
                if (typeof date === 'string') {
                    parsedDate = parseISO(date);
                } else {
                    parsedDate = date;
                }

                render(parsedDate);

                let intervalDuration = 30000;
                if (modifiers.includes('seconds')) {
                    intervalDuration = 5000;
                }

                interval = setInterval((): void => {
                    render(parsedDate);
                }, intervalDuration);
            });
        });

        cleanup(() => clearInterval(interval));
    });

    Alpine.magic('timeago', (): Function => (expression, pure, seconds, strictOptions): string => {
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

TimeAgo.configure = (config: { locale?: Locale }): Function => {
    if (config.locale) {
        locale = config.locale;
    }

    return TimeAgo;
}

export default TimeAgo;
