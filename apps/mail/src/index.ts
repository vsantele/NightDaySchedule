import dotenv from "dotenv";
import Imap from "imap";
import { simpleParser } from "mailparser";
import { processMail } from "./process";
dotenv.config();

const imap = new Imap({
	user: process.env.MAIL_USER!,
	password: process.env.MAIL_PASSWORD!,
	host: process.env.MAIL_HOST!,
	port: parseInt(process.env.MAIL_PORT!, 10) ?? 993,
	tls: true,
});

function openInbox(cb: (err: Error, box: Imap.Box) => void) {
	imap.openBox("INBOX", false, cb);
}

imap.once("ready", () => {
	console.log("Ready");
	openInbox(function (err, box) {
		if (err) throw err;
	});
});

imap.on("mail", (nbNewMail: number) => {
	console.log(nbNewMail);
	openInbox(function (err, box) {
		if (err) throw err;
		const f = imap.seq.fetch(`${box.messages.total}:*`, {
			// bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)", "TEXT"],
			bodies: "",
			struct: true,
		});
		f.on("message", function (msg, seqno) {
			console.log("Message #%d", seqno);
			var prefix = `(#${seqno}) `;
			msg.on("body", function (stream, info) {
				var buffer = "";
				stream.on("data", function (chunk) {
					buffer += chunk.toString("utf8");
				});
				stream.once("end", async function () {
					let parsed = await simpleParser(buffer);
					processMail(parsed);
				});
			});
			msg.once("end", function () {
				console.log(`${prefix}Finished`);
			});
		});
		f.once("error", function (err) {
			console.log(`Fetch error: ${err}`);
		});
		f.once("end", function () {
			console.log("Done fetching all messages!");
		});
	});
});

imap.once("error", function (err: Error) {
	console.log(err);
});

imap.once("end", function () {
	console.log("Connection ended");
});

imap.connect();
