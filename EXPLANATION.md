# Explanation of the implementation of the Queue.ts
* The initial version of the code multiple workers might pick up the same message when retrieving parallely.
* The message was immediately removed with the deque without the confirm.
* Usually when dequeing a message from a queue the message remains until the acknoledgement that it has been processed.
* To overcome this, we have to use a better data structure, in this case a map to keep the message id and message itself.
* Now, while dequeing we can return the message and acknowledge/confirm the message afterwards.
* We also keep the info if the message is being processed by worker using another data structure. This allows us to not return the same message to multiple workers and also track which worker handles what message.
* We also implement extra check to not allow some other worker confirm a message of the other one.
