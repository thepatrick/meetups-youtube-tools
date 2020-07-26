const moment = require('moment-timezone');
const { getAllEvents } = require('./src/sydjs');

(async () => {
  const { allEvents } = await getAllEvents({
    start: moment().subtract(1, 'year').tz('Australia/Sydney').toISOString()
  });

  allEvents.forEach(({ id, name, startTime }) => {
    const eventDate = moment(startTime).tz('Australia/Sydney').format('MMMM YYYY');
    console.log(`* ${eventDate}: ${name} (${id})`);

    // console.log(`Talks from ${event.name} on ${new Date(event.startTime)}`);
    // console.log(`Theme color: ${event.themeColor}`);
    // console.log(`Talks: ${event.talks.length}`);
  });

  // event.talks.forEach(({ id: talkId, name: talkName, speakers: talkSpeakers }) => {
  //   console.log('');

  //   console.log(`* ${talkId}: ${talkName} by ${talkSpeakers.length === 0 ? '(unknown)' : talkSpeakers.map(({ name }) => name).join(', ')}`);
  // });
})()
  .catch(e => console.error(e) && process.exit(1));
