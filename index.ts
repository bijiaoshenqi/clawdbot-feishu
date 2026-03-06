import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
// @ts-ignore - types not exported from main entry
import type { PluginHookSubagentSpawningEvent, PluginHookSubagentEndedEvent } from "openclaw/plugin-sdk/plugins/hooks";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";
import { feishuPlugin } from "./src/channel.js";
import { setFeishuRuntime } from "./src/runtime.js";
import { registerFeishuBitableTools } from "./src/bitable-tools/index.js";
import { registerFeishuDocTools } from "./src/doc-tools/index.js";
import { registerFeishuDriveTools } from "./src/drive-tools/index.js";
import { registerFeishuPermTools } from "./src/perm-tools/index.js";
import { registerFeishuTaskTools } from "./src/task-tools/index.js";
import { registerFeishuChatTools } from "./src/chat-tools/index.js";
import { registerFeishuUrgentTools } from "./src/urgent-tools/index.js";
import { registerFeishuWikiTools } from "./src/wiki-tools/index.js";
import { handleSubagentSpawning, handleSubagentEnded } from "./src/subagent.js";

const plugin = {
  id: "feishu",
  name: "Feishu",
  description: "Feishu/Lark channel plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    setFeishuRuntime(api.runtime);
    api.registerChannel({ plugin: feishuPlugin });
    
    // Register subagent spawning hook to support mode="session" + thread=true
    api.on("subagent_spawning", async (event: PluginHookSubagentSpawningEvent) => {
      return handleSubagentSpawning(event, api.config);
    });
    
    // Register subagent ended hook for automatic cleanup (prevents memory leaks)
    api.on("subagent_ended", async (event: PluginHookSubagentEndedEvent) => {
      await handleSubagentEnded(event);
    });
    
    registerFeishuDocTools(api);
    registerFeishuWikiTools(api);
    registerFeishuDriveTools(api);
    registerFeishuPermTools(api);
    registerFeishuBitableTools(api);
    registerFeishuTaskTools(api);
    registerFeishuChatTools(api);
    registerFeishuUrgentTools(api);
  },
};

export default plugin;
