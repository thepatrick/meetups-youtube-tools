const { request } = require('graphql-request');
const { curry } = require('ramda');

// talk: id, isLightningTalk
// event: description

const sydjsRequest = curry(
  (query, variables) => (
    request('https://sydjs-site-prod.herokuapp.com/admin/api', query, variables)
  )
);

const GET_EVENT_DETAILS = `
  query GetEventDetails($event: ID!) {
    Event(where: { id: $event }) {
      name
      startTime
      locationAddress
      locationDescription
      themeColor
      talks {
        id
        name
        speakers {
          name
        }
      }
    }
  }
`;

const GET_TALK_DETAILS = `
  query GetTalkDetails($talk: ID!) {
    Talk(where: { id: $talk }) {
      name
      description
      speakers {
        name
      }
      event {
        id
        name
        startTime
        locationDescription
      }
    }
  }
`;

// export const EVENT_DATA = gql`
//   fragment EventData on Event {

//   ${USER_IMAGE}
// `;

// export const GET_CURRENT_EVENTS = gql`
//   query GetCurrentEvents($now: DateTime!) {
//     upcomingEvents: allEvents(
//       where: { startTime_not: null, status: active, startTime_gte: $now }
//       orderBy: "startTime_DESC"
//     ) {
//       ...EventData
//     }
//     previousEvents: allEvents(
//       where: { startTime_not: null, status: active, startTime_lte: $now }
//       orderBy: "startTime_ASC"
//     ) {
//       ...EventData
//     }
//   }
//   ${EVENT_DATA}
// `;

// export const GET_ALL_EVENTS = gql`
//   {
//     allEvents(where: { startTime_not: null, status: active }, orderBy: "startTime_DESC") {
//       ...EventData
//     }
//   }
//   ${EVENT_DATA}
// `;

const GET_ALL_EVENTS = `
  query GetAllEvents($start: DateTime!) {
    allEvents(where: { startTime_not: null, status: active, startTime_gte: $start }, orderBy: "startTime_DESC") {
      id
      name
      startTime
    }
  }
`;
//     description

module.exports.getEventDetails = sydjsRequest(GET_EVENT_DETAILS);
module.exports.getTalkDetails = sydjsRequest(GET_TALK_DETAILS);
module.exports.getAllEvents = sydjsRequest(GET_ALL_EVENTS);
