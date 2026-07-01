# lifegame 数据模型

中文名：玩中取乐系统。

## 核心实体

### Persona

人格 / 身份。

字段建议：

- `id`
- `name`
- `slug`
- `purpose`
- `principles`
- `status`
- `energy_level`
- `risk_level`
- `created_at`
- `updated_at`

示例：

- `ceo`：Vault-Life 总控
- `work-yuanqi`：元气工作人格
- `baiheverse`：副业投资人
- `personal-investor`：个人投资者
- `renovation-manager`：装修经理
- `life-planner`：生活安排者

### Project

项目。

字段建议：

- `id`
- `persona_id`
- `name`
- `slug`
- `why`
- `status`
- `progress_note`
- `current_blocker`
- `next_action`
- `horizon`
- `created_at`
- `updated_at`

`horizon` 可选：

- `short`：1-14 天
- `mid`：2 周-3 个月
- `long`：3 个月以上

### Task

任务。

字段建议：

- `id`
- `persona_id`
- `project_id`
- `title`
- `description`
- `horizon`
- `status`
- `priority`
- `due_date`
- `source_conversation_id`
- `created_at`
- `updated_at`

状态建议：

- `now`
- `next`
- `later`
- `blocked`
- `done`
- `dropped`

### Thought

思考之地记录。

它可以来自 AI 对话、外部人员输入、临时想法、任务苗头或判断片段。它只负责分类和记录，不直接替代各人格 / 项目的执行空间。

字段建议：

- `id`
- `persona_id`
- `project_id`
- `agent_id`
- `source`
- `title`
- `summary`
- `diary_note`
- `raw_ref`
- `quality`
- `is_noise`
- `noise_reason`
- `created_at`
- `updated_at`

`raw_ref` 只存引用，不强制存全文。

### Question

从对话中提取出来的问题。

字段建议：

- `id`
- `conversation_id`
- `persona_id`
- `project_id`
- `text`
- `question_type`
- `status`
- `is_noise`
- `noise_reason`
- `created_at`

`question_type` 可选：

- `action`：我该怎么做
- `decision`：我该选哪个
- `reflection`：我为什么这样
- `emotion`：我现在怎么了
- `research`：我需要了解什么
- `test`：测试问题
- `smalltalk`：闲聊
- `meta`：关于系统本身

### Judgment

判断 / 决策。

字段建议：

- `id`
- `persona_id`
- `project_id`
- `title`
- `context`
- `decision`
- `why`
- `constraints`
- `review_at`
- `created_at`
- `updated_at`

### Agent

AI agent。

字段建议：

- `id`
- `name`
- `persona_id`
- `project_id`
- `role`
- `capabilities`
- `boundaries`
- `status`
- `handoff_protocol`
- `created_at`
- `updated_at`

### NPC

外部人员 / 外部输入源。

NPC 不是 Persona。Persona 是自己的身份和工作台，NPC 是外部影响来源。NPC 可以影响判断、任务优先级和情绪，但不能拥有最终决策权。

字段建议：

- `id`
- `name`
- `relationship`
- `influence_weight`
- `trust_level`
- `domain`
- `default_boundary`
- `notes`
- `created_at`
- `updated_at`

`influence_weight` 建议：

- `high`：高权重，输入会显著影响判断。
- `medium`：中权重，需要参考但不自动采纳。
- `low`：低权重，主要作为背景信息。

### Influence

外部影响记录。

字段建议：

- `id`
- `npc_id`
- `persona_id`
- `project_id`
- `conversation_id`
- `summary`
- `impact`
- `principle_delta`
- `weight`
- `accepted`
- `created_at`

`principle_delta` 用来记录：这次外部输入是否改变、强化或挑战了某条原则。

首版交互里，NPC 可以显式填写，也可以从对话中抽取，例如：

- `XXX 跟我说...`
- `XXX 建议我...`
- `XXX 认为...`
- `我妈提醒我...`

抽取结果先作为候选 NPC，后续可合并到正式人物 / NPC 档案。

## 最小关系

- 一个 Persona 可以有多个 Project。
- 一个 Project 属于一个主 Persona。
- Task 必须属于 Persona，可选属于 Project。
- Conversation 必须属于 Persona，可选属于 Project 和 Agent。
- Question 来源于 Conversation。
- Judgment 可由 Conversation 或 Question 触发。
- Agent 可以服务 Persona 或 Project。
- NPC 可以影响 Persona、Project、Question 或 Judgment，但不替代 Persona。
- Influence 是 NPC 进入系统的方式，最终仍由 `ceo` 总控拍板。

## 过滤规则

问题过滤不建议一开始自动化过度。首版用半自动规则：

- 明确包含“测试”“test”“随便问问”的，默认噪音。
- 只有工具验证、格式验证、模型试探且无行动含义的，默认噪音。
- 重复问题不删除，合并到同一个主题。
- 情绪问题不是噪音，除非用户明确标记。
- 娱乐和高风险活动不是噪音，但要进入风险视图。
