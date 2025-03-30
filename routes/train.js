const express = require("express");
const { Train,userSeats } = require("../models");

const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");

// 🟢 Create a Train
router.post("/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { name, numOfSeat, seatInRow, allBooked, createdBy } = req.body;
    const train = await Train.create({
      name,
      numOfSeat,
      seatInRow,
      allBooked,
      createdBy,
    });
    res.status(201).json(train);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔵 Get All Trains
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const trains = await Train.findAll();
    res.json(trains);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🟡 Get a Train by ID
router.get("/:id", isAuthenticated, async (req, res) => {
  const trainId = Number(req.params.id);
  const userId = Number(req.headers.userid);
  console.log(req.headers);
  if (!req.params.id || isNaN(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }else  if (!req.headers.userid || isNaN(req.headers.userid)) {
    return res.status(400).json({ message: "Invalid userID" });
  }
   else {
    //   const trainId = Number(id);
    try {
      console.log(Train, "Train");
      const train = await Train.findByPk(trainId);
      if (!train) return res.status(404).json({ error: "Train not found" });

      const existingBooking = await userSeats.findOne({ where: { trainId ,userID:userId }, raw: true });
     let seatBookedNow =[]
      if (existingBooking) {
        console.log(existingBooking)
       seatBookedNow = existingBooking.seatsNumber;
      }

      console.log({train,seatBookedNow:seatBookedNow});
      res.status(200).send({train,seatBookedNow:seatBookedNow});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
});
router.put("/reset", isAuthenticated, async (req, res) => {
  let trainId = req.body.trainId;
if (!trainId || isNaN(trainId)) {
    return res.status(400).json({ message: "Invalid ID" });
  } else {
       trainId = Number(trainId);
    try {
    
      const train = await Train.findByPk(trainId);
      let seatsPerRow = train.seatInRow;
      let numOfSeat = train.numOfSeat;
      let length = Math.floor(numOfSeat/seatsPerRow) + (numOfSeat%seatsPerRow == 0 ? 0 :1);
      let array = [...Array(length)].map(() => seatsPerRow);
     if(numOfSeat%seatsPerRow == 0 )
     {} 
     else
     {array[length-1] = numOfSeat%seatsPerRow};
        await Train.update(
            { allBooked: array }, 
            { where: { id: trainId } }
          );
          train.allBooked = array;
          


      if (!train) return res.status(404).json({ error: "Train not found" });
      const existingBooking = await userSeats.findAll({ where: { trainId  } });
      // let newBooking={};
      if (existingBooking) {
        let  newBooking = await userSeats.update({ seatsNumber :[] },{ where: { trainId} });
      }
     
      res.status(200).send(train);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
});


router.put("/book-seats", isAuthenticated, async (req, res) => {

  let trainId = req.body.trainId;
  let seats = req.body.seats;
  let userID = req.body.userId;
  // console.log(seats,trainId);

//  an array with queue functionaliity
const queue = [];
let front = 0; // Pointer to track the front

const enqueue = (item) => queue.push(item);
const dequeue = () => (front < queue.length ? queue[front++] : undefined);
const isEmpty = () => front >= queue.length;







  if (!trainId || isNaN(trainId)) {
    return res.status(400).json({ message: "Invalid ID" });
  } else if (!seats || isNaN(seats)) {
    return res.status(400).json({ message: "seat count is not defined" });
  } else {
    trainId = Number(req.body.trainId);
    seats = Number(req.body.seats);

    try {
   
      const train = await Train.findByPk(trainId);
      if (!train) return res.status(404).json({ error: "Train not found" });

      let seatInRow = train.seatInRow;
      let numOfSeat = train.numOfSeat;
      let flagRowNotEmpty = false;
      let notChangedAllBooked = [...train.allBooked];
      function SeatchangeArrayFunction(seat) {
        let array = [...train.allBooked];
        let jIndex = 1;
        let i = 0;
        let sum = array[0];
        let minDistance = 1000;
        let distanceParams = 0;
        let minDistanceIndexi = 0;
        let minDistance_jIndex = 0;
        let transferindexI =0 ;
        let transferindexJ =0;

        while (i < array.length && i < jIndex) {
          // sum +=array[jIndex];
          while (seat >= sum || jIndex < array.length) {
            sum += array[jIndex];
            distanceParams = distanceParams + 1;
           
            console.log(
              "seat>=sum",
              minDistance,
              distanceParams,
              minDistanceIndexi,
              minDistance_jIndex
            );

            jIndex++;
          }
          while (seat <= sum && i < array.length) {
            sum -= array[i];
            distanceParams = distanceParams - 1;
            // minDistance = Math.min(distanceParams,minDistance);

            if (distanceParams < minDistance && seat <= sum) {
              minDistance = distanceParams;
              minDistanceIndexi = i;
              minDistance_jIndex = jIndex;
            }
            console.log(
              "seat<sum",
              minDistance,
              distanceParams,
              minDistanceIndexi,
              minDistance_jIndex
            );
            i++;
          }
          i++;
          jIndex++;
        }

        console.log(array, minDistanceIndexi, minDistance_jIndex, minDistance);

        transferindexI = minDistanceIndexi;
        transferindexJ = minDistance_jIndex;
        let reseervedSeat = seat;
        while (minDistanceIndexi <= minDistance_jIndex) {
          if (reseervedSeat >= array[minDistanceIndexi]) {
            reseervedSeat -= array[minDistanceIndexi];
            array[minDistanceIndexi] = 0;
          } else if (
            reseervedSeat != 0 &&
            reseervedSeat < array[minDistanceIndexi]
          ) {
            array[minDistanceIndexi] = array[minDistanceIndexi] - reseervedSeat;
          }

          minDistanceIndexi++;
        }
        // console.log(array);
        return {array,minDistanceIndexi:transferindexI,minDistance_jIndex:transferindexJ};
      }
      function changeforSingleValued(seat) {
        let array = train.allBooked;
        
        
          for (let index = 0; index < array.length; index++) {

          if(seat <= array[index]){
           for(let a =0;a<seats ;a++){
            seatnumber = array.length-1 == index &&(numOfSeat%seatInRow !== 0)?((index)*7) +a+1 +((numOfSeat%seatInRow)-array[index]):((index)*7) +a+1 +(seatInRow-array[index])
            enqueue(seatnumber);
           }
            array[index]= array[index]-seat;
            flagRowNotEmpty =true;
            
            break;
          }
            
          }
          return array;
      }
     let allBoookedNew = changeforSingleValued(seats);
     if(!flagRowNotEmpty){
      let values = SeatchangeArrayFunction(seats);
      allBoookedNew = values.array;
      let reamingSeats = seats;
      let minDistanceIndexi = values.minDistanceIndexi-1;
      let minDistance_jIndex = values.minDistance_jIndex-1
      console.log(reamingSeats,minDistanceIndexi,minDistance_jIndex,notChangedAllBooked,);
      for(let b = minDistanceIndexi; b <=minDistance_jIndex;b++){
       let seatsValue =  notChangedAllBooked[b]    ; 
         if(seatsValue>reamingSeats){
          
          for(let a =0;a<reamingSeats;a++){
            seatnumber = notChangedAllBooked.length-1 == b &&(numOfSeat%seatInRow !== 0)?((b)*7) +a+1 +((numOfSeat%seatInRow)-notChangedAllBooked[b]):((b)*7) +a+1 +(seatInRow-notChangedAllBooked[b])
            console.log(seatnumber, notChangedAllBooked.length-1 == b,(numOfSeat%seatInRow !== 0));
            enqueue(seatnumber);
           }
         }
         else{
          for(let a =0;a<seatsValue;a++){
            seatnumber = notChangedAllBooked.length-1 == b &&(numOfSeat%seatInRow !== 0)?((b)*7) +a+1 +((numOfSeat%seatInRow)-notChangedAllBooked[b]):((b)*7) +a+1 +(seatInRow-notChangedAllBooked[b])
            console.log(seatnumber, notChangedAllBooked.length-1 == b,(numOfSeat%seatInRow !== 0));
           
            enqueue(seatnumber);
           }

         }

         reamingSeats -= seatsValue;
          
    
      }



     }


 console.log(queue);
     
      await Train.update(
        { allBooked: allBoookedNew }, 
        { where: { id: trainId } }
      );

      
        
    
        const existingBooking = await userSeats.findOne({ where: { userID,trainId  } });
        let newBooking={};
        if (existingBooking) {
           newBooking = await userSeats.update({ seatsNumber :queue },{ where: { userID: userID ,trainId} });
        }
        else{
           newBooking = await userSeats.create({ userID, seatsNumber:queue ,trainId});
        }
    
        
        
      
      // train.update({ allBooked:allBoookedNew });
      // await train.save();
      const io = req.app.get("io");

    // Broadcast seat update to all clients
    io.emit("seatUpdate", { seats, status: "booked" });


    let seatBookedNow = [...queue]
    // train['seatBookedNow'] =queue

    
      res.status(200).send({train,seatBookedNow} );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
});


router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const train = await Train.findByPk(req.params.id);
    if (!train) return res.status(404).json({ error: "Train not found" });

    await train.destroy();
    res.json({ message: "Train deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
