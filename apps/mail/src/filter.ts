import { ParsedMail } from "mailparser";

function validMail(mail: ParsedMail) {
	return mail.from?.value[0].address === process.env.FROM_ADDRESS;
}

export { validMail };
