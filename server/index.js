const express = require('express');
const cors = require('cors');
const moment = require('moment-timezone');
const { db } = require('./firebase.js');
const { Timestamp } = require('./firebase.js');

const app = express();
app.use(express.json());
app.use(cors());

const startTime = '08:00';
const endTime = '17:00';
const slotDuration = 30;

const getBusySlots = (docs) => {
    const busySlots = [];
    docs.map((d) => {
        // console.log()
        // console.log(new Date(d.data().date))
        busySlots.push({...d.data(), date: new Date(d.data().date).toLocaleString()});
    })
    return busySlots;
}

const getBetweenSlots = (startTime, endTime) => {
    start = parseInt(startTime) * 2 + (startTime.slice(-2) > 0);
    end = parseInt(endTime) * 2 + (endTime.slice(-2) > 0);
    return Array.from({length: end - start}, (_, i) =>
        (((i + start) >> 1) + ":" + ((i + start)%2*3) + "0"));
}

const getFreeSlots = (busySlots) => {
    const freeSlots = getBetweenSlots(startTime, endTime)
    console.log(busySlots)
    busySlots.map((slot) => {
        const tmp_date = new Date(slot.date.getTime() + slot.duration*60000)
        tmp_slots = getBetweenSlots(slot.date.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3"), tmp_date.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3"))
        // console.log(getBetweenSlots(slot.date.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3"), tmp_date.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")))
        if (freeSlots.includes(tmp_slots[0])) {
        freeSlots.splice(freeSlots.indexOf(tmp_slots[0]), tmp_slots.length)}
    })
    return freeSlots;
}

app.get('/data', async(req, res) => {
    const query = db.collection('events');
    const dt = new Date('2022-12-30');
    const dt1 = new Date('2022-12-31');
    console.log(new Date(dt.getTime()));
    query.where('date', '>=', dt.getTime()).where('date', '<', dt1.getTime()).get().then((doc) => {
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
    const date1=new Date(date)
    const date2=new Date(date)
    date2.setDate(date1.getDate() + 1);
    query.where('date', '>=', date1.getTime()).where('date', '<', date2.getTime()).orderBy('date').get().then((doc) => {
        if (!doc.empty) {
            const busySlots = getBusySlots(doc.docs);
            const freeSlots = getFreeSlots(busySlots);
            return res.status(200).send(freeSlots);
        }else {
            console.log('came here')
            return res.status(200).send(getBetweenSlots(startTime, endTime))
        }
    })
});

app.post('/create', async(req, res) => {
    const { time, duration, timezone, description, date } = req.body;
    const query = db.collection('events');
    // console.log(moment(date + " " + time).format())
    const date1=new Date(date)
    // date1.toLocaleString('en-US', { timeZone: 'America/New_York' })
    const date2=new Date(date)
    date2.setDate(date1.getDate() + 1);
    query.where('date', '>=', date1.getTime()).where('date', '<', date2.getTime()).get().then(async (doc) => {
        if (!doc.empty) {
            const busySlots = getBusySlots(doc.docs);
            let isBooked = false;
            busySlots.forEach((bs) => {
                const st = moment(bs.date.toLocaleTimeString, 'HH:mm:ss').date(1);
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
                    duration, date: date1.getTime(), timezone, description
                })
                res.status(200).send({  message: 'Booked..'})
            }
        }else{
            const eRef= db.collection('events');
                const newDoc = await eRef.doc().set({
                    duration, date: date1.getTime(), timezone, description
                })
                res.status(200).send({  message: 'Booked..'})
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