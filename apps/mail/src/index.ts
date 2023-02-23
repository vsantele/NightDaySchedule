import dotenv from "dotenv";
import type { Box } from "imap";
import { simpleParser } from "mailparser";

import { imap } from "./imap.js";
import { processMail } from "./process.js";
dotenv.config();

function openInbox(cb: (err: Error, box: Box) => void) {
	imap.openBox("INBOX", false, cb);
}

imap.once("ready", () => {
	console.log("Ready");
	openInbox(function (err, box) {
		if (err) throw err;
	});
});

imap.on("mail", (nbNewMail: number) => {
	openInbox(function (err, box) {
		if (err) throw err;
		imap.search(["NEW"], function (err, results) {
			if (err || !results.length) return;

			// fetch all resulting messages
			const f = imap.fetch(results, {
				// bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)", "TEXT"],
				bodies: "",
				struct: true,
				markSeen: true,
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
});

imap.once("error", function (err: Error) {
	console.log(err);
});

imap.once("end", function () {
	console.log("Connection ended");
});

imap.connect();
