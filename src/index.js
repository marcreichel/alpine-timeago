import formatDistanceToNow from "date-fns/formatDistanceToNow";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import parseISO from "date-fns/parseISO";
import isPast from "date-fns/isPast";

let locale = null;

function TimeAgo(Alpine) {
  Alpine.directive(
    "timeago",
    (el, { expression, modifiers }, { evaluateLater, effect, cleanup }) => {
      let evaluateDate = evaluateLater(expression);

      const render = (date) => {
        if (typeof date === "string") {
          date = parseISO(date);
        }

        try {
          if (modifiers.includes("strict")) {
            let unit = modifiers.includes("unit")
              ? modifiers[
                  modifiers.findIndex((modifier) => modifier === "unit") + 1
                ] || undefined
              : undefined;
            if (
              !["second", "minute", "hour", "day", "month", "year"].includes(
                unit
              )
            ) {
              unit = undefined;
            }
            let roundingMethod = modifiers.includes("rounding")
              ? modifiers[
                  modifiers.findIndex((modifier) => modifier === "rounding") + 1
                ] || undefined
              : undefined;
            if (!["floor", "ceil", "round"].includes(roundingMethod)) {
              roundingMethod = undefined;
            }
            el.textContent = formatDistanceToNowStrict(date, {
              addSuffix: !modifiers.includes("pure"),
              unit,
              roundingMethod,
              locale,
            });
          } else {
            el.textContent = formatDistanceToNow(date, {
              addSuffix: !modifiers.includes("pure"),
              includeSeconds: modifiers.includes("seconds"),
              locale,
            });
          }

          dispatch(date);
        } catch (e) {
          console.error(e);
        }
      };

      let interval;

      const dispatch = (date) => {
        el.dispatchEvent(new CustomEvent("timeago:render", { detail: { isPast: isPast(date) }, bubbles: false }));
      };

      const setupInterval = (date) => {
        let intervalDuration = 30000;
        if (modifiers.includes("seconds")) {
          intervalDuration = 5000;
        }

        interval = setInterval(() => {
          render(date);
        }, intervalDuration);
      };

      const intersectionObserver = new IntersectionObserver((entries) => {
        const [entry] = entries;
        const {isIntersecting} = entry;
        if (isIntersecting) {
          evaluateDate((date) => {
            if (!interval) {
              setupInterval(date);
              render(date);
            }
          });
        } else {
          if (interval) {
            clearInterval(interval);
            interval = undefined;
          }
        }
      });

      intersectionObserver.observe(el);

      effect(() => {
        evaluateDate((date) => {
          if (interval) {
            clearInterval(interval);
          }

          render(date);

          setupInterval(date);
        });
      });

      cleanup(() => clearInterval(interval));
    }
  );

  Alpine.magic("timeago", () => (expression, pure, seconds, strictOptions) => {
    if (pure == null) {
      pure = false;
    }
    if (seconds == null) {
      seconds = false;
    }
    if (strictOptions != null && (strictOptions["strict"] || undefined)) {
      return formatDistanceToNowStrict(expression, {
        addSuffix: !pure,
        unit: strictOptions["unit"] || undefined,
        roundingMethod: strictOptions["roundingMethod"] || undefined,
        locale,
      });
    }
    return formatDistanceToNow(expression, {
      addSuffix: !pure,
      includeSeconds: seconds,
      locale,
    });
  });
}

TimeAgo.configure = (config) => {
  if (config.hasOwnProperty("locale") && typeof config.locale === "object") {
    if (config.locale.hasOwnProperty("formatDistance")) {
      locale = config.locale;
    }
  }

  return TimeAgo;
};

export default TimeAgo;
