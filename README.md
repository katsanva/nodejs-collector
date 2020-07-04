This task is to create a simple events collector (EC). An EC would be a tool consisting of 3 modules,
accumulating reciever, filter and a reporter.

The flow for an event is as follows:
1. The event enters the reciever
2. The event is filtered and then
3. The event is stored in some buffer
4. The event is sent to the next part in the overall pipeline via the reporter.
Note: the next part in the pipeline might be a different module, a queue or even just a email depending on the situation

Each part can be arbitrarily complicated but for this task we simplify all the functionality as we want to see
your proficiency in JS and the way you design the program.

* The reciever should somehow store events and send them once there are 5 events stored or 3 seconds have passed.
Example:
Given the EC is empty, the EC get 9 messages in a row, all are good filter-wise. The first 5 events
should be sent immediately and the remaining 4 would wait. If no other events are recieved the 4 will be sent
3 seconds after the 6th event was recieved.
If, for example, 2 more events arrive, the 4 and the first to arrive should be sent immediately and the timer is reset,
i.e the second event will wait 3 seconds.
Hint: you can clear `setTimeout`ed functions.

* The filter should just filters out events that don't have data, i.e. if there is no data property or it's an empty object it
should not be sent through.

* The reporter just prints to the console, `console.log`, the events it gets.

You may use whatever tool/paradigm/version you wish but the code should be performant and easily extendable.
Keep in mind that this program usually works in high scale, so it might be broken to different services
so your design should be easily converted to such architecture.

Bonus points (make sure you finish the base before implementing these):
- write tests for the different parts
- use some schema validator (e.g. `ajv`) to filter out events that are not in the "data: id, timestamp" schema
- Implement a dedup function. If you recieve multiple events with the same data (excluding timestamp) 
	over a span of 10 second, only the first would be sent
- Use formatting to print the events with colors


# The code

a very basic skeleton exists in `routes/collect.js`

Getting stated
0. run `npm install`
1. Run `npm start` in order to start the EC
2. Run `npm test` in order to generate a stream of events. The generated events are objects
with a data that has only an id in it, and a timestamp
