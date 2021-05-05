// STAR MATCH - V2

//star display component extracted,
//replaced in React.fragment with StarsDisplay & props.count
const StarsDisplay = props => (
   <>
     {utils.range(1, props.count).map(starId =>
            <div key={starId} className="star" />
            //all but 1 star <div> are removed because
            //utils.range generates bet. 1 & 'stars' amount.random
          )}
   </>
);

//Number is N/A as a top level JS class for string to number,
//PlayNumber used instead

//# keypad component extracted out
//onClick temporarily does console.log
const PlayNumber = props => ( 
   <button 
     className="number" 
     style={{ backgroundColor: colors[props.status] }}
     onClick={() => console.log('Num', props.number)}
   >
    {props.number}
  </button>
);

const StarMatch = () => {
  const [stars, setStars] = useState(utils.random(1, 9));
  //useState adds dynamic state for Nums arrays;
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, setCandidateNums] = useState([]);
  
  const candidatesAreWrong = utils.sum(candidateNums) > stars;
  //cAW checks if amount of candidateNums is more than the stars
  //color style: if avaNums is false then 'used' is returned
  //otherwise cAW is checked to return 'wrong' or 'candidate'
  //(debug error log) every const needs initializing with =
  const numberStatus = (number) => {
    if (!availableNums.includes(number)) {
      return 'used';
    }
    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? 'wrong': 'candidate';
    }
  };
  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div> 
      <div className="body"> 
        <div className="left">
          <StarsDisplay count={stars}/>
        </div>
        <div className="right">
          {utils.range(1, 9).map(number =>
           <PlayNumber 
             key={number} 
             //availableNums, candidateNums, etc would work,
             //though it's TMI for a single PlayNumber since
             //it only cares about itself instead of all numbers
             //isUsed, isCandidate also works as booleans, yet
             //multiple values not preferred. 1 value status={} is best 
             status={numberStatus(number)}
             number={number}
          />
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
