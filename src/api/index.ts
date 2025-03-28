import { nextTick, unref } from 'vue';
import { useMessage } from 'naive-ui';
import { OLLAMA_API_BASE_URL } from "@/constant";
import { useChatStore } from "@/store";
import { v4 as uuidv4 } from "uuid";
import { 
  // convertMessagesToHistory,
  copyToClipboard,
  splitStream
} from '@/utils';

/**
 * @description 获取模型列表
 */
export async function getModels(url = "", type = "all") {
  const store = useChatStore()
  const $settings = store.settings;
  const message = useMessage();

		let models = [];
		const res = await fetch(`${url ? url : $settings?.API_BASE_URL ?? OLLAMA_API_BASE_URL}/tags`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			}
		})
			.then(async (res) => {
				if (!res.ok) throw await res.json();
				return res.json();
			})
			.catch((error) => {
				console.log(error);
				if ("detail" in error) {
					message.error(error.detail);
				} else {
					message.error("Server connection failed");
				}
				return null;
			});
		models.push(...(res?.models ?? []));
    store.setModels(models);
}

export async function sendPrompt(userPrompt: string, parentId: string, _chatId: string) {
  const store = useChatStore()
  const $selectedModels = store.selectedModels;
  const $db = store.db;

  await Promise.all(
    $selectedModels.map(async (model) => {
      await sendPromptOllama(model, userPrompt, parentId, _chatId);
    })
  );
  const chats = await $db.getChats()
  await store.setChats(chats);
	
}
async function sendPromptOllama (model: any, userPrompt: string, parentId: string, _chatId: string) {
  console.log("sendPromptOllama");
  let responseMessageId = uuidv4();
  const store = useChatStore();
  const $stopResponseFlag = store.stopResponseFlag
  const $settings = store.settings;
  const $chatId = store.chatId;
  const $title = store.title;
  const $db = store.db;
  const $selectedModels = store.selectedModels;
  const $history = store.history;
  const $messages = store.messages;
  let $autoScroll = store.autoScroll;
  let responseMessage = {
    parentId: parentId,
    id: responseMessageId,
    childrenIds: [],
    role: "assistant",
    content: "",
    model: model,
    done: false,
    context: null,
    info: null
  };

  $history.messages[responseMessageId] = responseMessage;
  $history.currentId = responseMessageId;
  if (parentId !== null) {
    $history.messages[parentId].childrenIds = [
      ...$history.messages[parentId].childrenIds,
      responseMessageId
    ];
  }

  await nextTick();
  window.scrollTo({ top: document.body.scrollHeight });

  const res = await fetch(`${$settings?.API_BASE_URL ?? OLLAMA_API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "text/event-stream"
    },
    body: JSON.stringify({
      model: model,
      messages: $messages.map((message) => ({
        role: message.role,
        content: message.content
      })),
      options: {
        seed: $settings.seed ?? undefined,
        temperature: $settings.temperature ?? undefined,
        repeat_penalty: $settings.repeat_penalty ?? undefined,
        top_k: $settings.top_k ?? undefined,
        top_p: $settings.top_p ?? undefined,
        num_ctx: $settings.num_ctx ?? undefined,
        ...($settings.options ?? {})
      },
      format: $settings.requestFormat ?? undefined
    })
  }).catch((err) => {
    console.log(err);
    return null;
  });

  if (res && res.ok && res.body) {
    const reader = res.body
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(splitStream("\n"))
      .getReader();

    while (true) {
      const { value, done } = await reader.read();
      if (done || $stopResponseFlag || _chatId !== $chatId) {
        responseMessage.done = true;
        store.setMessages(unref($messages))
        break;
      }

      try {
        let lines = value.split("\n");

        for (const line of lines) {
          if (line !== "") {
            console.log(line);
            let data = JSON.parse(line);

            if ("detail" in data) {
              throw data;
            }

            if (data.done == false) {
              if (responseMessage.content == "" && data.message.content == "\n") {
                continue;
              } else {
                responseMessage.content += data.message.content;
                store.setMessages(unref($messages))
              }
            } else {
              responseMessage.done = true;
              responseMessage.context = data.context ?? null;
              responseMessage.info = {
                total_duration: data.total_duration,
                load_duration: data.load_duration,
                sample_count: data.sample_count,
                sample_duration: data.sample_duration,
                prompt_eval_count: data.prompt_eval_count,
                prompt_eval_duration: data.prompt_eval_duration,
                eval_count: data.eval_count,
                eval_duration: data.eval_duration
              };
              store.setMessages(unref($messages))
              if ($settings.responseAutoCopy) {
                copyToClipboard(responseMessage.content);
              }
            }
          }
        }
      } catch (error: any) {
        console.log(error);
        if ("detail" in error) {
          window.$message.error(error.detail);
        }
        break;
      }

      if ($autoScroll) {
        window.scrollTo({ top: document.body.scrollHeight });
      }

      await $db.updateChatById(_chatId, {
        title: $title === "" ? "新对话" : $title,
        models: $selectedModels,
        options: {
          seed: $settings.seed ?? undefined,
          temperature: $settings.temperature ?? undefined,
          repeat_penalty: $settings.repeat_penalty ?? undefined,
          top_k: $settings.top_k ?? undefined,
          top_p: $settings.top_p ?? undefined,
          num_ctx: $settings.num_ctx ?? undefined,
          ...($settings.options ?? {})
        },
        messages: $messages,
        history: history
      });
    }
  } else {
    if (res !== null) {
      const error = await res.json();
      console.log(error);
      if ("detail" in error) {
        window.$message.error(error.detail);
        responseMessage.content = error.detail;
      } else {
        window.$message.error(error.error);
        responseMessage.content = error.error;
      }
    } else {
      window.$message.error(`Uh-oh! There was an issue connecting to Ollama.`);
      responseMessage.content = `Uh-oh! There was an issue connecting to Ollama.`;
    }

    responseMessage.error = true;
    responseMessage.content = `Uh-oh! There was an issue connecting to Ollama.`;
    responseMessage.done = true;
    // store.setMessages(messages)
  }

  store.setSTopResponseFlag(false);
  await nextTick();
  if ($autoScroll) {
    window.scrollTo({ top: document.body.scrollHeight });
  }

  if ($messages.length == 2 && $messages.at(1).content !== "") {
    window.history.replaceState(history.state, "", `/c/${_chatId}`);
    await generateChatTitle(_chatId, userPrompt);
  }
};

async function generateChatTitle(_chatId: string, userPrompt: string) {
  const store = useChatStore();
  const $settings = store.settings;
  const $selectedModels = store.selectedModels;
  
  if ($settings.titleAutoGenerate ?? true) {
    console.log('generateChatTitle');

    const res = await fetch(`${$settings?.API_BASE_URL ?? OLLAMA_API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/event-stream',
        ...($settings.authHeader && { Authorization: $settings.authHeader })
      },
      body: JSON.stringify({
        model: $selectedModels[0],
        prompt: `Generate a brief 3-5 word title for this question, excluding the term 'title.' Then, please reply with only the title: ${userPrompt}`,
        stream: false
      })
    })
      .then(async (res) => {
        if (!res.ok) throw await res.json();
        return res.json();
      })
      .catch((error) => {
        if ('detail' in error) {
          window.$message.error(error.detail);
        }
        console.log(error);
        return null;
      });

    if (res) {
      await setChatTitle(_chatId, res.response === '' ? $t("Sidebar.NewChat") : res.response);
    }
  } else {
    await setChatTitle(_chatId, userPrompt);
  }
};

async function setChatTitle (_chatId: string, _title: string) {
  const store = useChatStore();
  const $db = store.db;
  const $chatId = store.chatId;
  

  await $db.updateChatById(_chatId, { title: _title });
  if (_chatId === $chatId) {
    store.setTitle(_title);
  }
};