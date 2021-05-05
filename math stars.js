// STAR MATCH - V2

//Number is N/A as a top level JS class for string to number
//# keypad component extracted out
const PlayNumber = props => ( 
   <button className="number" onClick={() => console.log('Num', props.number)}>
    {props.number}
  </button>
);

const StarMatch = () => {
  const stars = utils.random(1, 9); 
  //Non-fixed # of stars bet. 1-9; Dynamic state needed
  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div> 
      <div className="body"> 
        <div className="left">
          {utils.range(1, stars).map(starId =>
            <div key={starId} className="star" />
            //all but 1 star <div> are removed because
            //utils.range generates bet. 1 & 'stars' amount.random
          )}
        </div>
        <div className="right">
          {utils.range(1, 9).map(number =>
           <PlayNumber key={number} number={number}/>
          //PlayNumber keypad # is generated here
          //only 1 <button> needed to make all since
          //range of buttons from 1-9 are genarated with .map
          )}
          
        </div>
      </div>
      <div className="timer">Time Remaining: 10</div>
    </div>
  );
};

// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

// Math science
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

ReactDOM.render(<StarMatch />, mountNode);
