module.exports = async function (context, myTimer) {
    const https = require('https');
    const HTMLParser = require('node-html-parser');
    const fetch = require('node-fetch');

    const groupToCheck = process.env['GROUP_TO_CHECK'];
 
    context.log(`Check website if group ${groupToCheck} can get vaccinated`);

    const result = await fetch('https://www.zh.ch/de/gesundheit/coronavirus/coronavirus-impfung/impfgruppen.html');

    for(selected of HTMLParser.parse(await result.text()).querySelectorAll('.mdl-table__row')) {
        if(selected.outerHTML.includes(`<strong>${groupToCheck}</strong>`) && 
            selected.querySelector('td:last-child').innerHTML.replace('&nbsp;', '') !== '') {

                const accountSid = process.env['ACCOUNT_SID'];
                const authToken = process.env['AUTH_TOKEN'];

                const client = require('twilio')(accountSid, authToken);

                const sentMessages = await client.messages.list({limit: 1});

                const sentAt = new Date(sentMessages.length == 0 ? 0 : sentMessages[0].dateSent).valueOf();
                const now = new Date().valueOf();

                if(now - sentAt > 3600 * 1000) {
                    context.log('older than an hour, send SMS');

                    const fromNumber = process.env['FROM_NUMBER'];
                    const toNumber = process.env['TO_NUMBER'];

                    const sent = await client.messages
                        .create({from: fromNumber, body: `Gruppe ${groupToCheck} hat sich geändert`, to: toNumber});
                    context.log(sent);
                }
            }
    }
};