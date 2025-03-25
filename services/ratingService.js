function calcRatingsMean(ratings) {
  let meanArray = [];

  for (let index = 0; index < ratings.length; index++) {
    let sum = 0;

    for (let number = 0; number < ratings[index].length; number++) {
      sum += ratings[index][number];
    }
    const count = ratings[index].length;
    const mean = sum / count;
    const meanFormat = mean.toFixed(2);
    meanArray.push(meanFormat);
  }
  return meanArray;
}

function combineArrays(ratings, imageData) {
  ratings = calcRatingsMean(ratings);
  let combinedArray = imageData;
  for (let index = 0; index < imageData.images.length; index++) {
    combinedArray.images[index].rating = ratings[index];
  }
  return combinedArray;
}

module.exports = { calcRatingsMean, combineArrays };
