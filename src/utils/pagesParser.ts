import { IPage, IPagesDict } from "../types";

export const pagesParser = (pages: IPage[]): IPagesDict => {
  return pages.reduce(
    (res, page, index) => ({ ...res, [page.docID]: { order: index, page } }),
    {}
  );
};
