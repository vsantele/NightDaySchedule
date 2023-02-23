import { ParsedMail } from "mailparser";
import { validMail } from "./filter";
import { schedule } from "./parser";
import { prisma } from "./prisma";

function processMail(mail: ParsedMail) {
	if (validMail(mail) && mail.text === undefined) {
		return;
	}

	const s = schedule(mail.text!);
	console.log(s);
}

export { processMail };
