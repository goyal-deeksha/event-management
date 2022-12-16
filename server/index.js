const express = require('express');
const moment = require('moment');
const { db } = require('./firebase.js');

const app = express();
app.use(express.json());

const startTime = '8:00';
const endTime = '17:00';
const slotDuration = 30;

const getBusySlots = (docs) => {
    const busySlots = [];
    docs.map((d) => {
        busySlots.push(d.data());
    })
    return busySlots;
}

app.get('/data', async(req, res) => {
    const query = db.collection('events');
    query.get().then((doc) => {
        if (doc.empty) {
            return res.status(400).send({ message: 'No data!' });
          } else {
            return res.status(200).send(getBusySlots(doc.docs));
          }
    })
});

app.post('/freeSlots', async(req, res) => {
    const { date } = req.body;
    const query = db.collection('events');
    query.where('date', '==', date).get().then((doc) => {
        if (!doc.empty) {
            let  sTime = moment(startTime, 'HH:mm:ss').date(1);
            let  eTime = moment(endTime, 'HH:mm:ss').date(1);
            const busySlots = getBusySlots(doc.docs);
            // const freeSlots = [];
            // busySlots.forEach((bs) => {
            //     const st = moment(bs.time, 'HH:mm:ss').date(1);
            //     const et = moment(st, 'HH:mm:ss').add(bs.duration, 'minutes').date(1);
            // })
            return res.status(200).send(busySlots);
        }
    })
});

app.post('/create', async(req, res) => {
    const query = db.collection('events');
    query.get().then(async (doc) => {
        if (!doc.empty) {
            const busySlots = getBusySlots(doc.docs);
            const { time, duration, date, timezone, description } = req.body;
            let isBooked = false;
            busySlots.forEach((bs) => {
                const st = moment(bs.time, 'HH:mm:ss').date(1);
                const et = moment(st, 'HH:mm:ss').add(bs.duration, 'minutes').date(1);
                const current = moment(time, 'HH:mm:ss').date(1)
                // console.log("st", st);
                // console.log("et", et);
                // console.log("current", current.isBetween(st, et));
                if (current.isBetween(st, et)) {
                    isBooked = true;
                    return;
                }
            })
            if (isBooked) {
                return res.status(422).send({ message: 'This slot is already booked' })
            } else {
                const eRef= db.collection('events');
                const newDoc = await eRef.doc().set({
                    duration, date, timezone, description, time
                })
                res.status(200).send({  message: 'Booked..'})
            }
        }
    })
})

app.post('/events', (req, res) => {
    const { startDate, endDate } = req.body;
    const query = db.collection('events');
    query.where('date','>=', startDate).where('date', '<=', endDate).get().then((doc) => {
        if (doc.empty) {
            return res.status(400).send({ message: 'No data!' });
          } else {
            return res.status(200).send(getBusySlots(doc.docs));
          }
    })
})

app.listen(3001, () => {
    console.log('app is running')
});