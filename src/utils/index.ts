import { v4 as uuidv4 } from "uuid";
//////////////////////////
// Helper functions
//////////////////////////

export const splitStream = (splitOn: string) => {
	let buffer = "";
	return new TransformStream({
		transform(chunk, controller) {
			buffer += chunk;
			const parts = buffer.split(splitOn);
			parts.slice(0, -1).forEach((part) => controller.enqueue(part));
			buffer = parts[parts.length - 1];
		},
		flush(controller) {
			if (buffer) controller.enqueue(buffer);
		}
	});
};

export const convertMessagesToHistory = (messages) => {
	let history = {
		messages: {},
		currentId: null
	};

	let parentMessageId = null;
	let messageId = null;

	for (const message of messages) {
		messageId = uuidv4();

		if (parentMessageId !== null) {
			history.messages[parentMessageId].childrenIds = [
				...history.messages[parentMessageId].childrenIds,
				messageId
			];
		}

		history.messages[messageId] = {
			...message,
			id: messageId,
			parentId: parentMessageId,
			childrenIds: []
		};

		parentMessageId = messageId;
	}

	history.currentId = messageId;
	return history;
};

export const copyToClipboard = (text: string | null) => {
	if (!navigator.clipboard) {
		var textArea = document.createElement("textarea");
		textArea.value = text || "";

		// Avoid scrolling to bottom
		textArea.style.top = "0";
		textArea.style.left = "0";
		textArea.style.position = "fixed";

		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			var successful = document.execCommand("copy");
			var msg = successful ? "successful" : "unsuccessful";
			console.log("Fallback: Copying text command was " + msg);
		} catch (err) {
			console.error("Fallback: Oops, unable to copy", err);
		}

		document.body.removeChild(textArea);
		return;
	}
	navigator.clipboard.writeText(text).then(
		function () {
			console.log("Async: Copying to clipboard was successful!");
		},
		function (err) {
			console.error("Async: Could not copy text: ", err);
		}
	);
};
