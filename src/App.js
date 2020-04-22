import React, {useState} from 'react';
import './App.css';
import { 
  AppBar, 
  Box, 
  Button, 
  ClickAwayListener,
  Dialog, 
  DialogActions, 
  DialogTitle, 
  DialogContent, 
  Grid,
  IconButton, 
  Slider, 
  Toolbar, 
  Typography, 
  Tooltip} from '@material-ui/core'
import { 
  Help, 
  Settings, }  from '@material-ui/icons'
import { 
  withStyles } from '@material-ui/core/styles'
import 'typeface-roboto'
import {ResponsiveBar} from '@nivo/bar'


const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
});

const DTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <DialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
    </DialogTitle>
  );
});

const DContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(DialogContent);

const DActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(DialogActions);

function Dice(props) {
  let dieListClassName = [];
  dieListClassName[0] = "die-list ";
  dieListClassName[1] = "die-list ";
  if (props.rollTrigger) {
    dieListClassName[0] += "even-roll";
    dieListClassName[1] += "odd-roll";
  } else {
    dieListClassName[0] += "odd-roll";
    dieListClassName[1] += "even-roll";
  }

  return (
    <div className="dice">
      <ol className={dieListClassName[0]} data-roll={props.diceRolls[0]} id="die-1">
        <li className="die-item" data-side="1">
          <span className="dot"></span>
        </li>
        <li className="die-item" data-side="2">
          <span className="dot"></span>
          <span className="dot"></span>
        </li>
        <li className="die-item" data-side="3">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </li>
        <li className="die-item" data-side="4">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </li>
        <li className="die-item" data-side="5">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </li>
        <li className="die-item" data-side="6">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </li>
      </ol>
      <ol className={dieListClassName[1]} data-roll={props.diceRolls[1]} id="die-2">
        <li className="die-item" data-side="1">
          <span className="dot"></span>
        </li>
        <li className="die-item" data-side="2">
          <span className="dot"></span>
          <span className="dot"></span>
        </li>
        <li className="die-item" data-side="3">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </li>
        <li className="die-item" data-side="4">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </li>
        <li className="die-item" data-side="5">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </li>
        <li className="die-item" data-side="6">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </li>
      </ol>
    </div>
  );
}

  

class FairDiceRoller {
  constructor(pRandRoll, nDecks) {
    this.probOfRandRoll = pRandRoll;
    this.numDecks = nDecks;
    this.reset();
  }
  setConfig(pRandRoll, nDecks) {
    let didConfigChange = false;
    if (pRandRoll !== this.probOfRandRoll ||
        nDecks !== this.numDecks) {
        didConfigChange = true;
    }
    this.probOfRandRoll=pRandRoll;
    this.numDecks = nDecks;
    if (didConfigChange) {
      this.reset();
    }
  }
  reset() { 
    this.buildDeck();
    //console.log('reset after build ' + JSON.stringify(this.deck));
    this.shuffleDeck();
    //console.log('reset after shuffle '+JSON.stringify(this.deck));
  }
  buildDeck() {
    this.deck=[];
    for (let n = 1; n <= this.numDecks; n++) {
      for (let i=1; i <= 6; i++) {
        for (let j=1; j <= 6; j++) {
          this.deck.push([i,j]);
        }
      }
    }
  }
  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }
  randomRoll() {
    return [
      Math.floor(Math.random() * 6)+1,
      Math.floor(Math.random() * 6)+1];
  }
  roll() {
    if (Math.random() >= (this.probOfRandRoll/100.0)) {
      console.log("returning a card draw");
      let r = this.deck.pop();
      if (this.deck.length === 0) this.reset();
      return r;
    }
    console.log("returning a pure random roll")
    return this.randomRoll();
  }
}
const fairDiceRoller = new FairDiceRoller(25,1);

function useStickyState(defaultValue, key) {
  const [value, setValue] = React.useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null
      ? JSON.parse(stickyValue)
      : defaultValue;
  });
  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

function App() {
  const [showConfig, setShowConfig] = useState(false);
  const [probHelpOpen, setProbHelpOpen] = useState(false);
  const [deckHelpOpen, setDeckHelpOpen] = useState(false);
  const [showGraph, setShowGraph] = useState(true);
  // -- config state
  const [probOfRandRoll, setProbOfRandRoll] = useStickyState(25, 'probOfRandRoll');
  const [numDecks, setNumDecks] = useStickyState(1, 'numberOfDecks');
  // -- dice state
  const [diceRolls, setDiceRolls] = useState([6,6]);
  const [rollTrigger, setRollTrigger] = useState(true);
  // -- graph state
  const initialRollCount=[
    {'diceTotal': '2', 'count': 0},
    {'diceTotal': '3', 'count': 0},
    {'diceTotal': '4', 'count': 0},
    {'diceTotal': '5', 'count': 0},
    {'diceTotal': '6', 'count': 0},
    {'diceTotal': '7', 'count': 0},
    {'diceTotal': '8', 'count': 0},
    {'diceTotal': '9', 'count': 0},
    {'diceTotal': '10','count': 0},
    {'diceTotal': '11','count': 0},
    {'diceTotal': '12','count': 0}];

  const [rollCount, setRollCount] = useState(initialRollCount);

  const handleConfigClose = () => {
    fairDiceRoller.setConfig(probOfRandRoll, numDecks);
    setShowConfig(false);
  }
  const handleProbHelpOpen = () => { setProbHelpOpen(true);}
  const handleProbHelpClose = () => { setProbHelpOpen(false);}
  const handleDeckHelpOpen = () => { setDeckHelpOpen(true);}
  const handleDeckHelpClose = () => { setDeckHelpOpen(false);}

  return (
    <div className="App">
      <AppBar position="sticky">
        <Toolbar display="flex">
          <Box flexGrow={1}><img src='./transparent-logolinear.png' height="36px" alt="Fairer Dice" align="left"/></Box>
          <IconButton color="inherit" 
            onClick={() => setShowConfig(true)}
          >
            <Settings/>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Dialog 
        open={showConfig} 
        onClose={handleConfigClose}>
        <DTitle onClose={handleConfigClose}>Config Options</DTitle>
        <DContent>
          <Grid direction='row' container='true' alignItems='center' justify='space-between'>
            <Grid item='true'>
              <Typography>% probability of random roll</Typography>
            </Grid>
            <Grid item='true'>
              <ClickAwayListener onClickAway={handleProbHelpClose}>
                <Tooltip
                  PopperProps={{
                    disablePortal: true,
                  }}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  placement="left"
                  onClose={handleProbHelpClose}
                  open={probHelpOpen}
                  title="On each roll an initial random event is used to determine whether to draw from the shuffled list of dice rolls (the deck) or a purely random dice roll.">
                  <IconButton><Help onClick={handleProbHelpOpen}/></IconButton>
                </Tooltip>
              </ClickAwayListener>
            </Grid>
          </Grid>
          <Slider          
            style={{width:'97%'}}
            value={probOfRandRoll} 
            min={0}
            max={100}
            step={1}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => v + "%"}
            onChange = {(event, value) => setProbOfRandRoll(value)}
          />
          <Grid direction='row' container='true' alignItems='center' justify='space-between'>
            <Grid item='true'>
              <Typography>Number of 36 roll card decks</Typography>
            </Grid>
            <Grid item='true'>
              <ClickAwayListener onClickAway={handleDeckHelpClose}>
                <Tooltip
                  PopperProps={{
                    disablePortal: true,
                  }}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  placement="left"
                  onClose={handleDeckHelpClose}
                  open={deckHelpOpen}
                  title="All 36 possible die combination are placed in a list like a deck of cards.  The deck is shuffled and cards are drawn to determine the roll.  One to three 36-card decks can be used">
                  <IconButton><Help onClick={handleDeckHelpOpen}/></IconButton>
                </Tooltip>
              </ClickAwayListener>
            </Grid>
          </Grid>
          <Slider
            style={{width:'97%'}}
            value={numDecks} 
            min={1}
            max={3}
            step={1}
            marks={[{value:1,label:'1'},
                    {value:2,label:'2'},
                    {value:3,label:'3'}]}
            onChange = {(event, value) => setNumDecks(value)}
          />
        </DContent>
        <DActions>
          <Button autoFocus onClick={handleConfigClose}>OK</Button>
        </DActions>
      </Dialog>
      <Box onClick={() => {
          let newDiceRoll = fairDiceRoller.roll();
          setDiceRolls(newDiceRoll);
          setRollTrigger(!rollTrigger);
          let rollCountIdx = newDiceRoll[0]+newDiceRoll[1]-2;
          let tempRollCounts = rollCount;
          tempRollCounts[rollCountIdx].count = tempRollCounts[rollCountIdx].count + 1;
          setRollCount(tempRollCounts);
        }}>
        <Box>
          <Dice
            diceRolls = {diceRolls}
            rollTrigger = {rollTrigger}   
          />
        </Box>
        <Box>
        <Typography variant="h1">
          {diceRolls[0]+diceRolls[1]}
        </Typography>
        </Box>
      </Box>
      <Box height="250px">
        <Box display="flex" justifyContent="flex-end" style={{width:'100%'}}>
          <Button
            onClick={() => {setShowGraph(!showGraph);}}
          >
            {showGraph ? 'Hide Graph' :  'Show Graph'}
          </Button>
        </Box>
        <Box display={showGraph ? 'flex':'none'} height='100%'>
          <ResponsiveBar
            //keys={['2','3,','4','5','6','7','8','9','10','11','12']}
            keys={['count']}
            data={rollCount}
            indexBy={"diceTotal"}
            margin={{top:50, right:50, bottom: 50, left: 50}}
            padding={0.3}
            colors={{scheme: 'red_yellow_blue'}}
            axisLeft={{
              tickSize:0,
              tickPadding:5,
              tickRotation:0,
              legend:'roll count',
              legendPosition:'middle',
              legendOffset:-35
            }}
            labelTextColor="white"
            animate={true}
            moitionStiffness={90}
            motionDamping={15}
          />
        </Box>
      </Box>
      <Box position="fixed" display="flex" justifyContent="flex-end" style={{width:'100%', bottom:'5px'}}>
        <Button 
          color="secondary"
          onClick={() => {setRollCount(initialRollCount);fairDiceRoller.reset();}}
        >
          Reset</Button>
      </Box>
    </div>
  );
}

export default App;
