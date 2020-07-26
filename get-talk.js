const h2p = require('html2plaintext');
const moment = require('moment-timezone');
const { resolve } = require('path');
const yargs = require('yargs');

const { getTalkDetails } = require('./src/sydjs');
const { wrapUploadVideo } = require('./src/wrapUploadVideo');

(async () => {
  const { talk, file } = yargs
    .option('talk', {
      alias: 't',
      describe: 'sydjs talk ID'
    })
    .option('file', {
      alias: 'f',
      description: 'Video file to upload'
    })
    .demandOption(['talk'], 'Please provide the talk ID to upload with this tool')
    .argv;

  const {
    Talk: {
      name: title,
      speakers,
      description: talkDescription,
      event: {
        id: eventId,
        name: eventName,
        startTime,
        locationDescription
      }

    }
  } = await getTalkDetails({ talk });

  const presentedBy = `Presented by ${speakers.length === 0 ? '(unknown)' : speakers.map(({ name }) => name).join(', ')}`;

  const talkDate = moment(startTime).tz('Australia/Sydney').format('MMMM Do, YYYY');

  const description = [
    presentedBy,
    '',
    h2p(talkDescription),
    '',
    `This was recorded at the  SydJS meetup ${eventName} on ${talkDate} at ${locationDescription}.`,
    '',
    `Find out more at https://www.sydjs.com/event/${encodeURIComponent(eventId)}`
  ].join('\n'); // .filter(f => typeof f === 'string')

  const keywords = ['javascript', 'meetup'];
  const category = 28; // Science & Technology - https://developers.google.com/youtube/v3/docs/videoCategories/list
  const privacyStatus = 'unlisted';

  const job = {
    snippet: {
      title,
      description,
      tags: keywords,
      categoryId: category
    },
    status: {
      privacyStatus
    }
  };

  const stars = Array.from({ length: 40 }).fill('*').join('');

  console.log(`Title: ${title}`);
  console.log(`Keywords: ${keywords.join(', ')}`);
  console.log(`Category: ${category}`);
  console.log(`Privacy Status: ${privacyStatus}`);
  console.log(`Description: \n${stars}\n${description}\n${stars}`);

  if (file) {
    console.log(`Upload: ${file}`);
    // console.log(JSON.stringify(job, null, 2));

    await wrapUploadVideo('python3', [
      resolve(__dirname, 'upload_video.py'),
      `--file=${file}`
    ], JSON.stringify(job));

    console.log('All done');
  }
})()
  .catch(e => console.error(e) && process.exit(1));
