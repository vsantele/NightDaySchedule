import type { Box } from "imap";
import { simpleParser } from "mailparser";

import { imap } from "./imap.js";
import logger from "./logger.js";
import { processMail } from "./process.js";

function openInbox(cb: (err: Error, box: Box) => void) {
	imap.openBox("INBOX", false, cb);
}

imap.once("ready", () => {
	logger.info("Ready");
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
				logger.info("Message #%d", seqno);
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
					logger.info(`${prefix}Finished`);
				});
			});
			f.once("error", function (err) {
				logger.error(`Fetch error: ${err}`);
			});
			f.once("end", function () {
				logger.info("Done fetching all messages!");
			});
		});
	});
});

imap.once("error", function (err: Error) {
	logger.error(err);
});

imap.once("end", function () {
	logger.info("Connection ended");
});

imap.connect();
