const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages');

const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';
const openaiApiKey = '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';

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    console.log("hit");
    //clear input

    outputMessage(msg);
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus(); //re focus the input so no need to click
});

function outputMessage(msg) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">You</p>
    <p class="text">
        ${msg}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
    openAIAnswer(msg);
}

function openAIAnswer(msg){
    const prompt = msg;
    
    fetch(openaiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
        messages: [
            {"role": "system", "content": "Let's roleplay. Pretend you're a medical clinic. The patient will have a skin disease and you have to prescibe next steps for what they should do after they have been given medication for it. Keep your response to a max of 500 characters. Here is what the patient said: " + prompt},
            {"role": "user", "content": ``},
        ],
          model: 'gpt-3.5-turbo'
        })
      })
      .then(response => response.json())
      .then(data => {
        
        const text = data.choices[0].message.content;
        msg = text;
        AIReply(msg);
      })
      .catch(error => {
        console.error(error);
    });
}

function AIReply(msg) {
    const div = document.createElement('div');
    div.classList.add('reply');
    div.innerHTML = `<p class="meta">AIDoctor</p>
    <p class="text">
        ${msg}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}