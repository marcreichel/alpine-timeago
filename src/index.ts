import { Alpine } from 'alpinejs';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import parseISO from 'date-fns/parseISO';

let locale: Locale = null;

export type Unit = 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year';
export type RoundingMethod = 'floor' | 'ceil' | 'round';

export interface StrictOptions {
    strict?: boolean;
    unit?: Unit;
    roundingMethod?: RoundingMethod;
}

export interface TimeAgoConfig {
    locale?: Locale;
}

type TimeAgoMagic = (
    expression: number | Date,
    pure?: boolean,
    seconds?: boolean,
    strictOptions?: StrictOptions,
) => string;

function TimeAgo(Alpine: Alpine): void {
    Alpine.directive(
        'timeago',
        (
            el: Node,
            { expression, modifiers },
            {
                evaluateLater,
                effect,
                cleanup,
            }: {
                evaluateLater: (
                    expression: string,
                ) => (result: unknown) => void;
                effect: (callback: () => void) => void;
                cleanup: (callback: () => void) => void;
            },
        ) => {
            const evaluateDate: (callback: (value: unknown) => void) => void =
                evaluateLater(expression);

            const render: (date: number | Date) => void = (
                date: number | Date,
            ): void => {
                try {
                    if (modifiers.includes('strict')) {
                        let unit: Unit;
                        if (modifiers.includes('unit')) {
                            const innerUnit: string =
                                modifiers[
                                    modifiers.findIndex(
                                        (modifier: string) =>
                                            modifier === 'unit',
                                    ) + 1
                                ] || undefined;
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
                        let roundingMethod: RoundingMethod;
                        if (modifiers.includes('rounding')) {
                            const innerRounding: string =
                                modifiers[
                                    modifiers.findIndex(
                                        (modifier: string) =>
                                            modifier === 'rounding',
                                    ) + 1
                                ] || undefined;
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
                } catch (e) {
                    console.error(e);
                }
            };

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

                    let intervalDuration: number = 30000;
                    if (modifiers.includes('seconds')) {
                        intervalDuration = 5000;
                    }

                    interval = setInterval((): void => {
                        render(parsedDate);
                    }, intervalDuration);
                });
            });

            cleanup((): void => clearInterval(interval));
        },
    );

    Alpine.magic(
        'timeago',
        (): TimeAgoMagic =>
            (
                expression: number | Date,
                pure: boolean = false,
                seconds: boolean = false,
                strictOptions?: StrictOptions,
            ): string => {
                if (strictOptions && strictOptions.strict) {
                    return formatDistanceToNowStrict(expression, {
                        addSuffix: !pure,
                        unit: strictOptions.unit,
                        roundingMethod: strictOptions.roundingMethod,
                        locale,
                    });
                }
                return formatDistanceToNow(expression, {
                    addSuffix: !pure,
                    includeSeconds: seconds,
                    locale,
                });
            },
    );
}

TimeAgo.configure = (config: TimeAgoConfig): Function => {
    if (config.locale) {
        locale = config.locale;
    }

    return TimeAgo;
};

export default TimeAgo;
