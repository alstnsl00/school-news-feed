async function getIndex(queryData: any, arg: string) {
  let currentIndex: number;
  if (queryData.Items.length > 0) {
    const currentIndexArray = queryData.Items.flatMap((e) =>
      Number(e[`${arg}`].N),
    );
    currentIndex = Math.max(...currentIndexArray);
  } else {
    currentIndex = 0;
  }

  return currentIndex;
}

export { getIndex };
