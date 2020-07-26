const { getEventDetails } = require('./src/sydjs');
const yargs = require('yargs');

(async () => {
  const { event: eventId } = yargs
    .option('event', {
      alias: 'e',
      describe: 'sydjs event ID'
    })
    .demandOption(['event'], 'Please provide the event ID to list talks')
    .argv;

  const { Event: event } = await getEventDetails({ event: eventId });

  console.log(`Talks from ${event.name} on ${new Date(event.startTime)}`);
  console.log(`Theme color: ${event.themeColor}`);
  console.log(`Talks: ${event.talks.length}`);

  event.talks.forEach(({ id: talkId, name: talkName, speakers: talkSpeakers }) => {
    console.log('');

    console.log(`* ${talkId}: ${talkName} by ${talkSpeakers.length === 0 ? '(unknown)' : talkSpeakers.map(({ name }) => name).join(', ')}`);
  });
})()
  .catch(e => console.error(e) && process.exit(1));
