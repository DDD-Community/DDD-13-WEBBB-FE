import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";

const KST_TIME_ZONE = "Asia/Seoul";
const TIME_ZONE_SUFFIX_PATTERN = /(Z|[+-]\d{2}:?\d{2})$/i;

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.locale("ko");
dayjs.updateLocale("ko", {
  relativeTime: {
    s: "방금",
    d: "1일",
  },
});

export function getTimeAgo(dateString?: string) {
  const normalizedDate = dateString?.trim();
  if (!normalizedDate) return null;

  try {
    const date = TIME_ZONE_SUFFIX_PATTERN.test(normalizedDate)
      ? dayjs(normalizedDate).tz(KST_TIME_ZONE)
      : dayjs.tz(normalizedDate, KST_TIME_ZONE);
    const now = dayjs().tz(KST_TIME_ZONE);

    if (!date.isValid()) return null;
    if (date.isAfter(now)) return "방금 전";

    return date.from(now);
  } catch {
    return null;
  }
}
