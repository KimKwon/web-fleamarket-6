import { MAX_PRICE } from '../constants/limit';

export const parseDateFromNow = (date: string) => {
  const today = new Date();
  const timeValue = new Date(date);

  const betweenTime = Math.floor(
    (today.getTime() - timeValue.getTime()) / 1000 / 60,
  );
  if (betweenTime < 1) return '방금전';
  if (betweenTime < 60) {
    return `${betweenTime}분전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 31) {
    return `${betweenTimeDay}일전`;
  }

  const betweenTimeMonth = Math.floor(betweenTime / 60 / 24 / 31);
  if (betweenTimeMonth < 12) {
    return `${betweenTimeMonth}달전`;
  }

  return `${Math.floor(betweenTimeDay / 365)}년전`;
};

export const parseLocaleStringToNumber = (localeString: string) => {
  const parsedNumber = Number(localeString.replace(/[^0-9]/g, ''));
  return parsedNumber >= MAX_PRICE ? MAX_PRICE - 1 : parsedNumber;
};

export const parseNumberToLocaleString = (priceNumber: number) => {
  if (priceNumber >= MAX_PRICE) return (MAX_PRICE - 1).toLocaleString();

  return priceNumber.toLocaleString();
};
