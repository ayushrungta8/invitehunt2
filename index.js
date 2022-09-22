var {
  ETwitterStreamEvent,
  TwitterApi,
  TwitterApiv2,
} = require("twitter-api-v2");
require("dotenv").config();
var Twit = require("twit");

var T = new Twit({
  consumer_key: process.env.APP_KEY,
  consumer_secret: process.env.APP_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_SECRET,
  timeout_ms: 60 * 1000,
  strictSSL: true,
});
const client = new TwitterApi(process.env.BEARER_TOKEN);

const twitterReadWriteClient = client.readWrite;

const streamFn = async () => {
  // await client.v2.updateStreamRules({
  //   add: [{ value: "@barterbengaluru", tag: "@barterbengaluru" }],
  //   // delete: {
  //   //   ids: ["1543589896023339009"],
  //   // },
  // });
  const rules = await client.v2.streamRules();
  console.log(rules);

  const stream = await client.v2.searchStream();

  stream.on(ETwitterStreamEvent.Data, (tweet) => {
    // console.log(tweet);
    // console.log(tweet.data.text);
    retweetIt(tweet?.data?.id);
  });
};
streamFn();

// console.log(client.currentUser());
const retweet = async (tweetId) => {
  console.log("retweetIt", tweetId);
  T.post(
    "statuses/retweet/:id",
    { id: tweetId },
    function (err, data, response) {}
  );
  // client.v2.retweet(tweetId);
};

// const undoRetweet = (tweetId) => {
//   T.post("statuses/unretweet/:id", { id: tweetId }, function (err, reply) {
//     if (err) {
//       console.log(err);
//     }
//     console.log(reply);
//   });
// };

const getTweetDetails = async (tweetId) => {
  const { data, response } = await twitterReadWriteClient.v2.get("tweets", {
    ids: tweetId,
    "tweet.fields": "conversation_id",
  });
  return { data, response };
};

// Below mentioned steps are for my reference you can ignore them

const retweetIt = async (tweetId) => {
  // 1. Fetch tweet details with id
  const { data } = await getTweetDetails(tweetId);
  console.log("retweetIt", data);

  // 2. Extract parentTweetId
  const parentTweetId = data[0]["conversation_id"];

  // 4. Check if already retweeted

  // 5. If yes, Skip

  // 6. else, Retweet
  retweet(parentTweetId);
};

// const undoRetweetIt = async (tweetId) => {
//   // 1. Fetch tweet details with id
//   const { data } = await getTweetDetails(tweetId);

//   // 2. Extract parentTweetId
//   const parentTweetId = data[0]["conversation_id"];

//   // 4. Check if already retweeted

//   // 5. If yes, undo retweet
//   undoRetweet(parentTweetId);

//   // 6. else, skip
// };
