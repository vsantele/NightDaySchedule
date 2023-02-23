import Imap from "imap";

declare global {
	var imap: Imap | undefined;
}

export const imap =
	global.imap ||
	new Imap({
		user: process.env.MAIL_USER!,
		password: process.env.MAIL_PASSWORD!,
		host: process.env.MAIL_HOST!,
		port: parseInt(process.env.MAIL_PORT!, 10) ?? 993,
		tls: true,
	});

if (process.env.NODE_ENV !== "production") global.imap = imap;
