import dayjs from "dayjs";

export const dateParser = (date: Date | null) => {
  if (!date) return null;
  const dd = date.getDate();
  const dd_str = dd < 10 ? "0" + dd : String(dd);
  const mm = date.getMonth() + 1;
  const mm_str = mm < 10 ? "0" + mm : String(mm);
  const yy = date.getFullYear();
  return dd_str + "." + mm_str + "." + yy;
};

export const dateParserForDayjs = (date: string | null) => {
  if (!date) return null;
  const [day, month, year] = date.split(".");
  const date_str = `${year}-${month}-${day}`;
  return dayjs(date_str);
};
