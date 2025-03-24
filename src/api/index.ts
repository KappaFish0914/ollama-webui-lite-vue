import { useMessage } from 'naive-ui';
import { OLLAMA_API_BASE_URL } from "@/constant";
import { useChatStore } from "@/store";


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