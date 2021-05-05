// STAR MATCH

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
     onClick={() => props.onClick(props.number, props.status)}
   >
    {props.number}
  </button>
);

const PlayAgain = props => (
  <div className="game-done">
    <div 
      className="message"
      style={{ color: props.gameStatus === 'lost' ? 'red' : 'green'}}
    >
      {props.gameStatus === 'lost' ? 'Game Over' : 'Success!'}
    </div>
    <button onClick={props.onClick}>Play Again</button>
  </div>
);

//all hooks and side effect/state hooks are first
//and then computations on that state
//as core app logic. Only later is the UI display
//based on the computed states.

//#1 core app logic hooks
const StarMatch = () => {
  const [stars, setStars] = useState(utils.random(1, 9));
  //useState adds dynamic state for Nums arrays;
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(10);
  // setInterval, setTimeout
  useEffect(() => {
    if (secondsLeft > 0 && availableNums.length > 0) {
      const timerId = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  });
 
  //#2 computations on state
  const candidatesAreWrong = utils.sum(candidateNums) > stars;
  //cAW checks if amount of candidateNums is more than the stars
  //color style: if avaNums is false then 'used' is returned
  //otherwise cAW is checked to return 'wrong' or 'candidate'
  // const gameIsWon = availableNums.length === 0;
  // const gameIsLost = secondsLeft === 0
  // Nested ternary covers both variables & states
  const gameStatus = availableNums.length === 0
    ? 'won'
    : secondsLeft === 0 ? 'lost' : 'active'
  const resetGame = () => {
    setStars(utils.random(1, 9));
    setAvailableNums(utils.range(1, 9));
    setCandidateNums([]);
  };
  
  const numberStatus = (number) => {
    if (!availableNums.includes(number)) {
      return 'used';
    }
    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? 'wrong': 'candidate';
    }
    return 'available';
  };
  
  const onNumberClick = (number, currentStatus) => {
    if(gameStatus !== 'active' || currentStatus == 'used') {
      return;
    }
    const newCandidateNums =
      currentStatus === 'available'
        ? candidateNums.concat(number)
        : candidateNums.filter(cn => cn !== number);
    
    if (utils.sum(newCandidateNums) !== stars) {
      setCandidateNums(newCandidateNums);
    } else {
      const newAvailableNums = availableNums.filter(
        n => !newCandidateNums.includes(n)
      );
      setStars(utils.randomSumIn(newAvailableNums, 9))
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
    }
  }
  
  //#3 UI description based on states/computations
  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div> 
      <div className="body"> 
        <div className="left">
          {gameStatus !== 'active' ? (
            <PlayAgain onClick={resetGame} gameStatus={gameStatus} />
          ) : ( //SD now in logic to check gID & <PA/>
            <StarsDisplay count={stars}/>
          )}
        </div>
        <div className="right">
          {utils.range(1, 9).map(number =>
           <PlayNumber 
             key={number}
             status={numberStatus(number)}
             number={number}
             onClick={onNumberClick}
          />
          //PlayNumber keypad # is generated here
          //only 1 <button> needed to make all since
          //range of buttons from 1-9 are genarated with .map
          )}
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
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
