import { RangeStateType } from "@/Components/commons/baseType";

export const getConvertedChartPrices = (priceArray: Array<number>): Array<Array<number>> => {
  const sortedPrices = [...priceArray].sort((a, b) => a - b);
  const PRICE_POINT = 20000;
  const MAX_PRICE = 1000000;
  let currentPrice = 0;

  const priceList = sortedPrices.reduce((acc: Array<Array<number>>, price) => {
    if (currentPrice === MAX_PRICE) {
      acc[acc.length - 1].push(price);
      return acc;
    }
    while (!(currentPrice < price && price <= currentPrice + PRICE_POINT) && currentPrice < MAX_PRICE) {
      currentPrice += PRICE_POINT;
      acc.push([]);
    }
    acc[acc.length - 1].push(price);
    return acc;
  }, [[]]);

  const lengthToFill = 51 - priceList.length;
  const resultArray = [...priceList, ...Array.from({ length: lengthToFill }, () => [])];
  return resultArray;
}

export type GraphType = RangeStateType & {
  priceArray: Array<Array<number>>
}

export const getAveragePrice = ({ rangeState: { leftRange, rightRange }, priceArray }: GraphType) => {
  const priceArrayLength = priceArray.length;

  const selectedPriceArray = priceArray.map((count, idx) => {
    const isSelect = (leftRange / (100 / priceArrayLength)) <= idx && idx < Math.floor(rightRange / (100 / priceArrayLength));
    return isSelect ? count : 0;
  });

  const flattenedPriceArray = selectedPriceArray.flat();

  const totalPrice = flattenedPriceArray.reduce((acc, cur) => acc + cur, 0);
  const selectedPriceCount = flattenedPriceArray.filter(price => price).length;

  return Math.floor(totalPrice / selectedPriceCount);
}

type PriceCountArrayType = {
  priceCountArray: Array<number>;
}

export const getOnePriceSize = ({ priceCountArray }: PriceCountArrayType) => {
  const maxSize = Math.max(...priceCountArray);
  const oneSize = 100 / maxSize;
  return oneSize;
}

type LinesType = PriceCountArrayType & {
  oneSize: number;
  viewBoxPosition: {
    minX: number;
    minY: number;
    width: number;
    height: number;
  }
}

export const getLines = ({ oneSize, priceCountArray, viewBoxPosition }: LinesType) => {
  const { minY, width, height } = viewBoxPosition;
  return `M${minY}, ${height} \n ${priceCountArray.map((count, idx, array) => {
    const currentCount = count ? 100 - (count * oneSize) : 100;
    const nextCount = array[idx + 1] ? 100 - (array[idx + 1] * oneSize) : 100;
    return `C${idx * 10 + 5}, ${currentCount}
              ${idx * 10 + 5}, ${nextCount}
            ${idx * 10 + 10}, ${nextCount}`;
  }).join('\n')}\n L${width},${height}`;
}

type SelectedLinesType = LinesType & RangeStateType;

export const getSelectedLines = ({ priceCountArray, oneSize, rangeState, viewBoxPosition }: SelectedLinesType) => {
  const { leftRange, rightRange } = rangeState;
  const { minY, width, height } = viewBoxPosition;

  const selectedLine = `M${minY}, ${height} \n ${priceCountArray.map((count, idx, array) => {
    const isSelect = (leftRange / (100 / priceCountArray.length)) <= idx
      && idx < Math.floor(rightRange / (100 / priceCountArray.length));
    const isNextSelect = (leftRange / (100 / priceCountArray.length)) <= idx + 1
      && idx + 1 < Math.floor(rightRange / (100 / priceCountArray.length));
    const currentCount = isSelect ? 100 - (count * oneSize) : 100;
    const nextCount = isNextSelect ? 100 - (array[idx + 1] * oneSize) : 100;

    return `C${idx * 10 + 5}, ${currentCount}
                ${idx * 10 + 5}, ${nextCount}
                ${idx * 10 + 10}, ${nextCount}`;
  }).join('\n')}\n L${width},${height}`;

  return selectedLine;
}