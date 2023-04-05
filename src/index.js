const dotenv = require('dotenv');
const config = dotenv.config({ path: '~/.openai' }).parsed;
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const { Configuration, OpenAIApi } = require("openai");

// enable cors && json
app.use(cors());
app.use(express.json());
app.use(express.static('static'));

// openai
const configuration = new Configuration({
    apiKey: config.API_KEY
});
const openai = new OpenAIApi(configuration);

const askQuestion = async (question) => {

    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: question,
        temperature: 0.5,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
    });
    if (response
        && response.data
        && response.data.choices.length > 0
        && response.data.choices[0].text) {
        return response.data.choices[0].text;
    } else {
        return 'i do not understand';
    }
}

// the route
app.post('/api/response', async (req, res) => {
    const body = req.body;
    console.log('input:', body.words);
    if (body && body.words) {
        const answer = (await askQuestion(body.words)).replace(/\n/g, ' ');;
        console.log('output:', answer);
        res.json({ message: answer });
    } else {
        res.json({ message: 'No question. No answer.' });
    }
});

// handle html
// Define middleware to serve static files from the public directory
app.use(express.static(path.join(__dirname, 'static')));

// Define middleware to handle root route
app.use('/', (req, res, next) => {
    // Send index.html file from public directory
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

app.listen(3000, () => {
    console.log('Chat GPT server started on port 3000');
});
