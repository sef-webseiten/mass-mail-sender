import fs from "fs";

export function parseMail(mailPath) {

    console.info("Reading mail content");

    const content = fs.readFileSync(mailPath, 'utf-8').split(/\r?\n/);

    const mail = { subject: content[0], content: content[1] };

    console.info(`Using mail with subject "${mail.subject}"`)

    return mail;

}