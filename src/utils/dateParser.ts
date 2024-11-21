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

export const getDateRange = (payload: {
	isSimpleDateLimit?: boolean;
	dateType: number;
	simpleDateMax?: string;
	simpleDateMin?: string;
}) => {
	const { isSimpleDateLimit, dateType, simpleDateMax, simpleDateMin } = payload;
	if (isSimpleDateLimit) {
		return [
			dateParserForDayjs(simpleDateMin!.split(" ")[0]),
			dateParserForDayjs(simpleDateMax!.split(" ")[0]),
		];
	}

	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 1);
	const tomorrow = new Date(today);
	tomorrow.setDate(today.getDate() + 1);

	switch (dateType) {
		case 1: {
			return [dayjs("1000-01-01"), dayjs(yesterday)];
		}
		case 2: {
			return [dayjs("1000-01-01"), dayjs(today)];
		}
		case 3: {
			return [dayjs(tomorrow), dayjs("2100-12-31")];
		}
		case 4: {
			return [dayjs(today), dayjs("2100-12-31")];
		}
		case 0:
		default: {
			return [dayjs("1000-01-01"), dayjs("2100-12-31")];
		}
	}
};

// const formatDate = (date: Date): string => {
//   const day = String(date.getDate()).padStart(2, "0");
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const year = date.getFullYear();
//   return `${day}.${month}.${year}`;
// };

export const getDateRangeMessage = (dateType: number) => {
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 1);
	const tomorrow = new Date(today);
	tomorrow.setDate(today.getDate() + 1);

	switch (dateType) {
		case 1: {
			return `Пожалуйста, выберите прошедшую дату. `;
		}
		case 2: {
			return `Пожалуйста, выберите прошедшую дату, включая сегодня. `;
		}
		case 3: {
			return `Пожалуйста, выберите будущую дату. `;
		}
		case 4: {
			return `Пожалуйста, выберите будущую дату, включая сегодня `;
		}
		case 0:
		default:
			return "";
	}
};
