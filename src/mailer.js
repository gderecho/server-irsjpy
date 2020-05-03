// This is really bad but
// it's the only way I could find to use
// only the gmail http send api

const nm = require('nodemailer')
const config = require('./config')
const key = {
    client_id: config.mailer_client_id,
    secret: config.mailer_secret,
    refresh_token: config.mailer_refresh_token
}
const { google } = require('googleapis')
const mime = require('mimetext')
const yaml = require('json2yaml')

// -- Authentication
const oauth2 = google.auth.OAuth2
const client = new oauth2(
    key.client_id,
    key.secret,
    "https://developers.google.com/oauthplayground"
)

client.setCredentials({
    refresh_token: key.refresh_token
})

google.options({
    auth: client
})

// -- Email
const utify = (str) => {
    return `=?utf-8?B?${Buffer.from(str).toString('base64')}?=`
}


const makeMessage = (content) => {
    return `
※このメールはシステムからの自動返信です。

この度はお忙しい中、IR支援フォームよりお問い合わせくださいまして誠にありがとうございます。
以下の内容で受け付けました。
24時間以内に、当方より改めてご連絡申し上げます。

${yaml.stringify(content)}

ご質問及び回答を修正される場合はいつでも可能です。
このメールアドレスにその旨を記載のうえ、ご返信くださいますようお願い申し上げます。

防護用具を工夫し立ち向かっている姿にエールを送るとともに、
大変な現状と向き合っている方々を全力で
応援しております。

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
IR支援 volunteer team
https://irshien.org
Email: contact@irshien.org
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    `
}




const gmail = google.gmail('v1')

async function send(obj) {
    const email = new mime()
    email.setSender({
        name: utify('IR支援　自動返信'),
        addr: 'automatic@irshien.org'
    })
    email.setSubject('お問い合わせありがとうございます')
    email.setHeaders({
        'Reply-To': `${utify('IR支援プロジェクト')} <contact@irshien.org>`,
        'Bcc': 'contact@irshien.org'
    })
    email.setRecipient({
        name: utify(obj.name),
        addr: obj.email
    })
    email.setMessage(
        makeMessage(obj)
    )

    try {
        const res = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: email.asEncoded()
            }
        });
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    send: send
}
