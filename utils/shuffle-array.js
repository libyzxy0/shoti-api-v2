function shuffleArray(array) {
  let shuffledArray = array.slice(); // Create a copy of the original array
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
  }
  return shuffledArray;
}

// Example usage:
/*
const myArray = [1, 2, 3, 4, 5];
const shuffledArray = shuffleArray(myArray);
console.log(shuffledArray);
*/
module.exports = shuffleArray;