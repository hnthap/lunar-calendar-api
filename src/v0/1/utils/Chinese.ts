/**
 * 
 * @param value An integer from 1 to 30
 * @returns Chinese numerical value, that frequently used on calendar.
 */
export function stringifyChineseNumerical(value: number): string {
  if (value == 20) {
    return "二十";
  } else {
    const tens = Math.floor(value / 10.0) * 10;
    const units = value - tens;
    return getChineseDigit(tens) + getChineseDigit(units);
  }
}

/**
 * 
 * @param value An integer from 1 to 10, or 20, or 30
 * @returns Corresponding Chinese numerical value.
 */
export function getChineseDigit(value: number): string {
  switch (value) {
    case 1:
      return "一";
    case 2:
      return "二";
    case 3:
      return "三";
    case 4:
      return "四";
    case 5:
      return "五";
    case 6:
      return "六";
    case 7:
      return "七";
    case 8:
      return "八";
    case 9:
      return "九";
    case 10:
      return "十";
    case 20:
      return "廿";
    case 30:
      return "三十";
    default:
      return "";
  }
}
