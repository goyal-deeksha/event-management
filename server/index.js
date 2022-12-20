const express = require('express');
const cors = require('cors');
const moment = require('moment-timezone');
const { db } = require('./firebase.js');
require('dotenv').config()

const app = express();
app.use(express.json());
app.use(cors());

const startTime = '08:00';
const endTime = '17:00';
const slotDuration = 30;

const getBusySlots = (docs) => {
    const busySlots = [];
    docs.map((d) => {
        busySlots.push({...d.data(), date: d.data().date});
    })
    return busySlots;
}

const getBetweenSlots = (date, startTime, endTime) => {
    let st = moment(new Date(date).setHours(parseInt(startTime), startTime.slice(-2))).unix();
    const mt = st + slotDuration*60;
    const en = moment(new Date(date).setHours(parseInt(endTime), endTime.slice(-2))).unix();
    const all = [];
    while(st <= en) {
        all.push(st);
        st += slotDuration*60;
    }
    return all;
}

const getFreeSlots = (date, busySlots = [], timezone) => {
    const freeSlots = getBetweenSlots(date, startTime, endTime)
    if (busySlots.length > 0) {
        busySlots.map((slot) => {
            const mt = slot.date +  slot.duration*60;
            if (freeSlots.includes(slot.date)) {
            freeSlots.splice(freeSlots.indexOf(slot.date), 1)}
        })
    }
    return Array.from(freeSlots, (d) =>
        (moment.tz(moment.unix(d),timezone).format()));
}

app.post('/freeSlots', async(req, res) => {
    const { date,timezone } = req.body;
    const query = db.collection('events');
    const date1=new Date(date)
    const date2=new Date(date)
    date2.setDate(date1.getDate() + 1);
    query.where('date', '>=', moment(date1).unix()).where('date', '<', moment(date2).unix()).orderBy('date').get().then((doc) => {
        if (!doc.empty) {
            const busySlots = getBusySlots(doc.docs);
            const freeSlots = getFreeSlots(date, busySlots, timezone);
            return res.status(200).send(freeSlots);
        }else {
            return res.status(200).send(getFreeSlots(date, [], timezone))
        }
    })
});

const createEvent = async (eObj) => {
    const { time, duration, date, description } = eObj;
    const eRef= db.collection('events');
    console.log(moment(new Date(date).toISOString()))
    const newDoc = await eRef.doc().set({
        duration, date: moment(new Date(date).setHours(parseInt(time), time.slice(-2))).unix(), description
    });
    return newDoc;
}

app.post('/create', async(req, res) => {
    const { time, date } = req.body;
    const st = moment(new Date(date).setHours(parseInt(startTime), startTime.slice(-2))).unix();
    const et = moment(new Date(date).setHours(parseInt(endTime), endTime.slice(-2))).unix();
    const currentTime = moment(new Date(date).setHours(parseInt(time), time.slice(-2))).unix();
    const query = db.collection('events');
    const date1=new Date(date)
    const date2=new Date(date)
    date2.setDate(date1.getDate() + 1);
    query.where('date', '>=', moment(date1).unix()).where('date', '<', moment(date2).unix()).get().then(async (doc) => {
        if (!doc.empty) {
            const busySlots = getBusySlots(doc.docs);
            let isBooked = false;
            busySlots.forEach((bs) => {
                const st = bs.date;
                const et = st + slotDuration*60;
                if (currentTime >= st && currentTime <= et) {
                    isBooked = true;
                    return;
                }
            })
            if (isBooked) {
                return res.status(422).send({ message: 'This slot is already booked' })
            } else if (currentTime < st || currentTime >= et) {
                return res.status(422).send({ message: 'Not available during these hours!' })
            } else {
                const eDoc = createEvent({ ...req.body })
                res.status(200).send({  message: 'Booked..'})
            }
        } else {
            if (currentTime < st || currentTime >= et) {
                return res.status(422).send({ message: 'Not available during these hours!' })
            } else {
                const eDoc = createEvent({ ...req.body })
                res.status(200).send({  message: 'Booked..'})
            }
        }
    })
})

app.post('/events', (req, res) => {
    const { startDate, endDate } = req.body;
    const query = db.collection('events');
    query.where('date','>=', moment(new Date(startDate)).unix()).where('date', '<=', moment(new Date(endDate)).unix()).get().then((doc) => {
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