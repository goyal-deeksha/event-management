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
        // const dt = moment((d.data().date).toDate()).tz('America/Los_Angeles');
        const dt1 = moment.tz(new Date(d.data().date),"America/Los_Angeles").format();
        busySlots.push({...d.data(), date: dt1});
    })
    return busySlots;
}

const getBetweenSlots = (startTime, endTime) => {
    start = parseInt(startTime) * 2 + (startTime.slice(-2) > 0);
    console.log("start === " , start);
    end = parseInt(endTime) * 2 + (endTime.slice(-2) > 0);
    console.log("end === " , end);
    return Array.from({length: end - start}, (_, i) =>
        (((i + start) >> 1) + ":" + ((i + start)%2*3) + "0"));
}

const getFreeSlots = (busySlots) => {
    const freeSlots = getBetweenSlots(startTime, endTime)
    console.log("freeSlots ==== ", freeSlots)
    busySlots.map((slot) => {
        const dt = new Date(slot.date);
        const tmp_date = new Date(dt.getTime() + slot.duration*60000)
        tmp_slots = getBetweenSlots(dt.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3"), tmp_date.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3"))
        console.log("between ==== ", getBetweenSlots(dt.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3"), tmp_date.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")))
        if (freeSlots.includes(tmp_slots[0])) {
        freeSlots.splice(freeSlots.indexOf(tmp_slots[0]), tmp_slots.length)}
    })
    return freeSlots;
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
    const date1=new Date(date)
    const date2=new Date(date)
    date2.setDate(date1.getDate() + 1);
    query.where('date', '>=', date1).where('date', '<', date2).orderBy('date').get().then((doc) => {
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
    const { time, duration, description, date } = req.body;
    const query = db.collection('events');
    // console.log(moment(date + " " + time).format())
    const date1=new Date(date)
    // date1.toLocaleString('en-US', { timeZone: 'America/New_York' })
    const date2=new Date(date)
    date2.setDate(date1.getDate() + 1);
    // query.where('date', '>=', date1).where('date', '<', date2).get().then(async (doc) => {
    //     if (!doc.empty) {
    //         const busySlots = getBusySlots(doc.docs);
    //         let isBooked = false;
    //         busySlots.forEach((bs) => {
    //             const st = moment(bs.date.toLocaleTimeString, 'HH:mm:ss').date(1);
    //             const et = moment(st, 'HH:mm:ss').add(bs.duration, 'minutes').date(1);
    //             const current = moment(time, 'HH:mm:ss').date(1)
    //             // console.log("st", st);
    //             // console.log("et", et);
    //             // console.log("current", current.isBetween(st, et));
    //             if (current.isBetween(st, et)) {
    //                 isBooked = true;
    //                 return;
    //             }
    //         })
    //         if (isBooked) {
    //             return res.status(422).send({ message: 'This slot is already booked' })
    //         } else {
    //             const eRef= db.collection('events');
    //             console.log(moment(date1).tz('America/Los_Angeles').toDate())
    //             const newDoc = await eRef.doc().set({
    //                 duration, date: moment(date1).tz('America/Los_Angeles'), description
    //             })
    //             res.status(200).send({  message: 'Booked..'})
    //         }
    //     } else {
            const eRef= db.collection('events');
            console.log(moment(date1).tz('America/Los_Angeles'))
                const newDoc = await eRef.doc().set({
                    duration, date: date1.getTime(), description
                })
                res.status(200).send({  message: 'Booked..'})
    //     }
    // })
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