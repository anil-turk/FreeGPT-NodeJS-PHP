
import axios from 'axios';


let connect;
import('puppeteer-real-browser').then(module => {
    connect = module.connect;
});


const site = ""; // your php site url where you get the prompt data and send the response
// No API key required.
const wait = 10000;  // wait time in milliseconds for each request
const userpass = ''; // if you have password directory protection add the username and password here (end with @) format: username:password@
let useproxy = false; // if you want to use proxy set it to true
const proxy = {
    get: async () => {
        try {
            const responseForProxy = await axios.get('https://raw.githubusercontent.com/mmpx12/proxy-list/master/proxies.txt');
            const lines = responseForProxy.data.split("\n");
            const proxyArray = lines.map(item => {
                const parts = item.split("://");
                if (parts.length !== 2) return null; // Skip lines that don't match the expected format
                const protocol = parts[0];
                const ipAndPort = parts[1].split(":");
                if (ipAndPort.length !== 2) return null; // Skip lines with unexpected structure
                return {
                    host: ipAndPort[0],
                    port: ipAndPort[1]
                };
            }).filter(proxy => proxy !== null); // Remove null entries
            return proxyArray;
        } catch (error) {
            console.error("Error fetching proxy list:", error);
            return []; // or handle error as per your requirement
        }
    }
};
const extractYouChatToken = (response) => {
  const tokens = [];
  const eventIndex = response.indexOf("event: youChatToken");

  if (eventIndex !== -1) {
    let eventString = response.substring(eventIndex);
    const nextEventIndex = response.indexOf("event:", eventIndex + 1);

    if (nextEventIndex !== -1) {
      const abTestIndex = eventString.indexOf("event: abTestSlices");
      eventString = abTestIndex !== -1 ? eventString.substring(0, abTestIndex) : eventString.substring(0, nextEventIndex);
    }

    eventString.split("\n").forEach(line => {
      if (line.trim() !== "" && line.includes("data:")) {
        try {
          const tokenData = JSON.parse(line.substring(line.indexOf("{")));
          tokens.push(tokenData.youChatToken);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }
    });
  } else {
    console.error("No 'event: youChatToken' found in the response.");
  }
  return tokens.join("");
};

const gpt = {
  ask: async (query, pageNumber = 1) => {
      if (query.trim() === "") {
          console.error("Cannot parse a blank query.");
          return null;
      }
   let browser,proxydata;
      const apiUrl = `https://you.com/api/streamingSearch?q=${encodeURIComponent(query)}&page=${pageNumber}&count=10&domain=youchat`;
        if(useproxy){
             proxydata = proxy.get();
        }else{
             proxydata = {};
        }
     return connect({
          turnstile: true,
         proxy: proxydata
      })
          .then(async response => {
              const { page, browser, setTarget } = response


              await Promise.all([
                  page.goto(apiUrl, {waitUntil: 'domcontentloaded', timeout: 30000 }), // waits for 5 seconds
                  page.waitForFunction(
                      text => document.body.innerHTML.includes(text),
                      { timeout: 30000 }, // waits for 30 seconds
                      "event: done"
                  ),
              ]);
              setTarget({ status: false })

              try {

                  const content = await page.content();
                  //console.log(content);
                  let returnResponseString = extractYouChatToken(content);
                  return returnResponseString;
              } catch (error) {
                  console.error("Bot failed to fetch response:", error);
                  return null;
              }finally {
                  await browser.close();
              }
          })





  }
};
async function main() {

  let prompts,matches;
  var langs = [];

  try {

    const responsefromget = await axios.get('https://'+userpass+site+'?action=get'); // You will get prompt data with json format
    prompts = responsefromget.data;


    console.log('Data received successfully');
    console.log('prompts', prompts);
  } catch (error) {
    console.error('Error:', error);
  }
  outerLoop:
  for (var i in prompts) {
    console.log(i + prompts[i]);
    for (let z = 1; z <= 10; z++) {
      console.log("sending try:" + z);
      try {

          let response = await gpt.ask(prompts[i]); // bot will respond in few secs
          console.log(response);
            //IMPORTANT NOTE: IF you are asking JSON format on the prompt use bottom function to extract JSON object. If you are not use only response variable.
        matches = extractJSONObject(response); // Use match method to find all matches

        console.log(matches); // Output the matches
        let isproblem = false;
        if (matches !== null) {

          console.log("respond retrieved."); // value returned
          break; // exiting try loop of 10 try

        }else{ console.error('value is null'); }
      } catch (error) {
        console.error("Error:", error);
      }
      await new Promise(r => setTimeout(r, wait));
    }
    /* STARTING TO SEND DATA */
    try {

      const translationData = {
        v_id: i,
        matches: JSON.stringify(matches)
      };
      console.error(translationData);
      // Assuming you have an endpoint to send this data
      const responsefrompost = await axios.post('https://'+userpass+site+'?action=post', translationData, {
        headers: {
          'Content-Type': 'application/json'
        }});
      console.log('Data sent successfully');
      console.log(responsefrompost.data);
    } catch (error) {
      console.error('Error:', error);
    }
    await new Promise(r => setTimeout(r, wait));
  }


}
function extractJSONObject(inputString) {
  const matches = inputString.match(/(?:\{[^{}]+\})(?=[^{}]*$)/g);

  if (matches && matches.length > 0) {
    // Extract the last matched JSON object
    const lastJSONObjectString = matches[matches.length - 1];

    // Check if it's a valid JSON object
    try {
      const jsonObject = JSON.parse(lastJSONObjectString);
      return jsonObject;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  } else {
    console.error("No JSON object found in the input string.");
    return null;
  }
}

main();