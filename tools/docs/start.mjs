const productThesis = {
  slug: "product-thesis",
  order: 999,
  section: "起点",
  sectionEn: "START",
  eyebrow: "PRODUCT THESIS · 01",
  titleLead: "为什么是「等它干」，",
  titleGrad: "不是助手。",
  plainTitle: "产品主旨与亮点定位",
  lead:
    "助手回答一个问题，生产线交回一批可核对的判断。OpenAcademic 把「读过并真的知道」拆成可验证的交付物、可归因的漏检和 append-only 的轨迹——这三件事决定了它为什么存在。",
  desc: "OpenAcademic 产品主旨：交付物、判断与操作的分界，漏检可归因，以及轨迹轴为什么是承重墙。",
  card: "交付物、漏检归因与轨迹轴：产品为什么成立。",
  updated: "2026-11-19",
  read: "8 分钟",
  status: "已发布",
  facts: [
    { b: "3", s: "承重判断：交付物 / 归因 / 轨迹" },
    { b: "4", s: "人一周只做四个动作" },
    { b: "0", s: "刻意保留的聊天式交互" }
  ],
  related: ["architecture", "usage-flow", "research-methodology"],
  sections: [
    {
      id: "position",
      num: "01",
      title: "定位：交付物不是聊天记录",
      html: `
        <p class="lead-in">大多数科研助手优化的是「这一轮答得像不像」。OpenAcademic 优化的是「一周之后，这条结论还在不在、敢不敢拿去用」。</p>
        <p>所以它不以对话为中心，而以<strong>收件箱</strong>为中心：你登录后先看到的是状态线、待确认的决定、三列看板与本周清单。聊天只是派活的一种入口，不是最终产物。</p>
        <div class="split2">
          <div class="panel">
            <span class="k">助手的产物</span>
            <h4>一段看起来合理的回答</h4>
            <p>上下文消失，结论就消失；引用是转述，无法回原文；错了只能重新问一遍。</p>
          </div>
          <div class="panel">
            <span class="k">生产线的产物</span>
            <h4>一条挂得出处的判断</h4>
            <p>落到领域条目里，带 ID、节锚点与原文引句；可以确认、推翻、搁置，变更留痕。</p>
          </div>
        </div>
        <p>这条分界写在数据里而不是文案里：判断经 <code>save_item</code> 契约发表，候选态等人裁决；已定位的判断必须带一段<strong>逐字引句</strong>，发表时按归一化规则在所称节的正文里核对命中；派活落 <code>tasks</code>，干完停在「待验」；扫描通道每次运行都写 <code>channel_runs</code> 回执。界面只是这些状态的视图。</p>
        <div class="claim">
          <div class="claim-top"><span class="k">一条条目 · 结构示意</span><span class="state">候选 · 待确认</span></div>
          <p class="claim-t">LooGLE 的长依赖题说明：上下文变长后，掉点集中在需要跨段拼接证据的题目上，而不是检索本身。</p>
          <div class="claim-src"><span class="claim-id">arXiv 2311.04939</span><span class="claim-sec">§4 · Results</span><span class="claim-sec">引句已核对</span></div>
          <p class="claim-quote">“…the drop concentrates on questions whose evidence spans multiple distant segments.”</p>
          <div class="claim-foot"><span>判断 <b>不是摘要</b></span><span>出处 <b>不是链接列表</b></span><span>推翻时 <b>理由必填</b></span></div>
        </div>
      `
    },
    {
      id: "judgment",
      num: "02",
      title: "三个判断：交付物、漏检、轨迹",
      html: `
        <p>产品里所有取舍都可以回溯到三句话。它们不是价值主张，是验收标准。</p>
        <div class="pillars">
          <div class="pillar">
            <b>01 · DELIVERABLE</b>
            <h4>交付物是判断，不是操作</h4>
            <p>判断可以进稿子、进幻灯片、进组会讨论；操作只说明「我点过这个按钮」。</p>
          </div>
          <div class="pillar">
            <b>02 · ATTRIBUTION</b>
            <h4>漏检必须可归因</h4>
            <p>没扫到、通道失败、扫到没派、派了没读——每一种都要在清单里留下痕迹。</p>
          </div>
          <div class="pillar">
            <b>03 · TRAJECTORY</b>
            <h4>判断的变更必须留痕</h4>
            <p>起草、确认、推翻、搁置都写进 append-only 的轨迹轴，理由不能省。</p>
          </div>
        </div>
        <h3>为什么漏检比错检更危险</h3>
        <p>错检会在核对时暴露，漏检不会。一篇该读的论文没进候选池，组里没有人会知道它存在。因此产品不承诺「完美召回」，而是承诺<strong>每条通道跑了什么、哪里没跑、为什么没命中，都写进本周清单</strong>。三通道的设计、<code>skip</code> / <code>fail</code> 回执与候选池去重，都是为这一条服务的。</p>
        <h3>为什么轨迹轴是承重墙</h3>
        <p>模型会变、prompt 会改、论文会被新版本替换。如果判断只是一次写入，半年后无法解释「当时为什么这么判」。轨迹轴保存的是判断的变更日志：谁在什么依据上起草，谁确认，谁推翻，理由是什么。它让「读过的结论」从一次性输出变成可审计的资产。</p>
        <blockquote>素材层的错误没人能发现，所以错了必须看得见。</blockquote>
      `
    },
    {
      id: "boundary",
      num: "03",
      title: "为什么不做「更聪明的助手」",
      html: `
        <p>更聪明的助手仍然把认知负担留在人身上：你得知道该问什么、怎么追问、答案可不可信。OpenAcademic 反过来，把人的动作压缩到四个：<strong>交一句话、确认或推翻、开组会、勾四态</strong>。</p>
        <div class="dtable">
          <table>
            <thead><tr><th>能力</th><th>聊天助手</th><th>OpenAcademic</th></tr></thead>
            <tbody>
              <tr><td><b>入口</b></td><td>对话框，等人想清楚问题</td><td>收件箱，状态先于问题</td></tr>
              <tr><td><b>过程</b></td><td>一轮轮追问，过程不可见</td><td>三列看板 + 工具轨迹，进行中可见</td></tr>
              <tr><td><b>结果</b></td><td>文本，随手复制走</td><td>领域条目，带 ID / 节锚点 / 引句</td></tr>
              <tr><td><b>纠错</b></td><td>重新提问</td><td>确认 / 推翻 / 搁置，理由入轨迹轴</td></tr>
              <tr><td><b>漏检</b></td><td>无法回答「你没读什么」</td><td>通道回执 + 粗筛未读 + 候选池</td></tr>
              <tr><td><b>复用</b></td><td>依赖上下文窗口</td><td>判断落库，跨周、跨会话存在</td></tr>
            </tbody>
          </table>
        </div>
        <p>这也是为什么产品不做「对话里直接建领域」「删除论文的 UI 入口」「会议纪要与 PPT 生成」。这些不是欠债，是边界：每加一个入口，都会稀释「判断—出处—轨迹」这条主链。</p>
      `
    },
    {
      id: "lifecycle",
      num: "04",
      title: "一条判断的完整生命周期",
      html: `
        <p>从一句话到一条可引用的判断，会经过六个状态。每个状态都有明确的归属与可见性。</p>
        <div class="flow">
          <div class="flow-step"><b>01</b><strong>派活</strong><span>一句话 + 领域，落 <code>tasks</code>，进队列。</span></div>
          <i>→</i>
          <div class="flow-step"><b>02</b><strong>扫描</strong><span>三通道按周跑，候选落池并去重。</span></div>
          <i>→</i>
          <div class="flow-step"><b>03</b><strong>精读</strong><span>按节读原文，工具轨迹可见。</span></div>
          <i>→</i>
          <div class="flow-step"><b>04</b><strong>发表</strong><span><code>save_item</code> 写入候选态，引句逐字核对。</span></div>
          <i>→</i>
          <div class="flow-step"><b>05</b><strong>裁决</strong><span>人确认 / 推翻 / 搁置，理由入轴。</span></div>
          <i>→</i>
          <div class="flow-step"><b>06</b><strong>复用</strong><span>交付本周清单，进稿子与组会。</span></div>
        </div>
        <p>注意第 4 步：agent 只能「发表」判断，不能「定稿」判断。候选态是产品里最重要的权限边界——它把模型的不确定性留在人能看见的位置，而不是靠置信度分数藏在后台。</p>
        <div class="callout">
          <span class="k">设计后果</span>
          <p>如果一条判断没有出处，它应该显示「未定位」，而不是补一个像样的节号。如果一条通道挂了，它应该记 <code>skip</code> 或 <code>fail</code>，而不是让清单看起来完整。产品的可信度来自这些不体面的状态被保留下来。</p>
        </div>
      `
    },
    {
      id: "highlight",
      num: "05",
      title: "亮点定位：它到底强在哪",
      html: `
        <p>面向访客的一句话版本：<strong>派方向，它自己扫通道、持续读、持续比对、持续记；你收回来的不是聊天记录，而是能直接进稿子的结论。</strong>展开成四条可验证的差异：</p>
        <div class="split2">
          <div class="panel">
            <span class="k">01 · EVIDENCE</span>
            <h4>每条结论追得到原文</h4>
            <p><code>ID</code> + 节锚点 + 引句三件套；引句必须逐字来自所称的节（12–300 字符、连续一段），定位不到就显式标记，禁止编造节号或引句。</p>
          </div>
          <div class="panel">
            <span class="k">02 · COVERAGE</span>
            <h4>没读到的东西也看得见</h4>
            <p>关键词 + OpenAlex 前向 / 后向三条通道；粗筛未读附一句不读的理由。</p>
          </div>
          <div class="panel">
            <span class="k">03 · CHANGE</span>
            <h4>判断变更可追溯</h4>
            <p>轨迹轴 append-only；推翻必须写理由，理由先由 agent 起草，人只改。</p>
          </div>
          <div class="panel">
            <span class="k">04 · OWNERSHIP</span>
            <h4>数据留在自己机器上</h4>
            <p>Apache-2.0，自部署；论文、笔记与判断都在工作区目录，不依赖外部服务。</p>
          </div>
        </div>
        <div class="strip">
          <div><b>100/100</b><span>OpenAlex 对齐</span><em>2026-11-13 代理样本</em></div>
          <div><b>3</b><span>扫描通道</span><em>关键词 + 前向 / 后向</em></div>
          <div><b>27</b><span>工具绑定</span><em>单轮自主调度</em></div>
          <div><b>40</b><span>轮数上限</span><em>主循环，子代理 20</em></div>
        </div>
      `
    },
    {
      id: "notdo",
      num: "06",
      title: "刻意不做的边界",
      html: `
        <p>产品的可信度不仅来自做了什么，也来自明确不做什么。以下方向已对齐为「不做」，提 PR 前需要先推翻这份共识，而不是顺手加上。</p>
        <ul class="pillrow">
          <li class="no">每人自带 API Key（BYOK）</li>
          <li class="no">登录改 JWT</li>
          <li class="no">对话里直接建领域</li>
          <li class="no">删除论文的 UI 入口</li>
          <li class="no">run_bash 进模型工具表</li>
          <li class="no">统计持久化与历史回溯</li>
          <li class="no">会议纪要 / PPT / 外部日历</li>
          <li class="no">无界 todo 硬拒</li>
        </ul>
        <p>判断标准只有一条：<strong>它是否强化「判断—出处—轨迹」主链</strong>。强化则做，稀释则不做；与模型是否更强无关。</p>
        <div class="callout warn">
          <span class="k">常见误读</span>
          <p>「不做」不等于「永远不会做」，而是「不在当前产品边界内」。如果要把其中一项纳入，需要同时说明它如何不破坏交付物的可核对性，以及轨迹轴如何记录它带来的新状态。</p>
        </div>
      `
    },
    {
      id: "takeaway",
      num: "07",
      title: "读完这篇，带走什么",
      html: `
        <p>如果你只记三件事：</p>
        <ol>
          <li><b>交付物是判断。</b>没有 ID、节锚点与引句的文本，不算产品输出。</li>
          <li><b>漏检要可归因。</b>通道回执、粗筛未读、候选池去重，比「召回率」更能说明系统是否可信。</li>
          <li><b>轨迹轴是承重墙。</b>判断的变更日志让半年后的你能解释当时的决定。</li>
        </ol>
        <p>接下来建议按顺序读：<a href="./architecture.html">系统架构</a>看机制，<a href="./usage-flow.html">一周流程</a>看人怎么用，<a href="./roadmap.html">路线图</a>看现在缺什么。三篇读完，后面的数据与工程文档才知道该往哪看。</p>
      `
    }
  ]
};

const architecture = {
  slug: "architecture",
  order: 2,
  section: "起点",
  sectionEn: "START",
  eyebrow: "ARCHITECTURE · 02",
  titleLead: "它怎么跑，",
  titleGrad: "怎么不跑飞。",
  plainTitle: "系统架构",
  lead:
    "一个 Agent 内核，两种外壳。单轮循环负责「下一步做什么」，工具注册表负责「能做什么」，三层记忆与两档压缩负责「还记得什么」，HITL 审批负责「哪些不能自己干」。",
  desc: "OpenAcademic 系统架构：单轮循环、工具注册与分发、三层记忆、上下文压缩、限流与 HITL 审批。",
  card: "单轮循环、工具注册、三层记忆与审批边界。",
  updated: "2026-11-19",
  read: "10 分钟",
  status: "已发布",
  facts: [
    { b: "40", s: "主循环轮数上限" },
    { b: "27", s: "模型可见工具绑定" },
    { b: "3", s: "层记忆与检索" }
  ],
  related: ["product-thesis", "architecture-diagram", "reliability"],
  sections: [
    {
      id: "overview",
      num: "01",
      title: "总览：一个内核，两种外壳",
      html: `
        <p>CLI 与 Web 不是两套实现，而是同一套 <code>core</code> 的两个入口。工具、记忆、上下文管理、扫描通道都在 <code>core</code>；<code>backend</code> 只做会话、鉴权、事件流与工作区路由。依赖方向是硬约束：</p>
        <div class="flow vert">
          <div class="flow-step"><b>SHELL</b><strong>Web / Next.js · CLI</strong><span>收件箱、清单、领域工作台、命令行。</span></div>
          <i>↓</i>
          <div class="flow-step"><b>BACKEND</b><strong>FastAPI + SSE</strong><span>登录、会话归属、右栏进度、AG-UI 事件流。</span></div>
          <i>↓</i>
          <div class="flow-step"><b>CORE</b><strong>Agent 循环 · 工具 · 记忆 · 扫描</strong><span>不反向依赖 backend，可在 CLI 里单独跑。</span></div>
          <i>↓</i>
          <div class="flow-step"><b>STORAGE</b><strong>SQLite + Chroma + 工作区目录</strong><span>论文、判断、任务、通道回执与向量索引。</span></div>
        </div>
        <p>这条依赖方向决定了两件事：CLI 可以先于 Web 验证能力；Web 的页面状态必须来自后端契约，而不是前端自己编。前端切换路由不丢操作，也依赖同一份工作区状态。</p>
      `
    },
    {
      id: "request",
      num: "02",
      title: "请求怎么进来",
      html: `
        <p>一次「派出去」不是直接调用模型，而是先落任务、再进队列。这样刷新、断线、重启都不会把活弄丢。</p>
        <div class="flow">
          <div class="flow-step"><b>01</b><strong>提交</strong><span>一句话 + 领域，写 <code>tasks</code>。</span></div>
          <i>→</i>
          <div class="flow-step"><b>02</b><strong>排队</strong><span>进程内队列；<code>queued</code> 重启可恢复。</span></div>
          <i>→</i>
          <div class="flow-step"><b>03</b><strong>运行</strong><span>Agent 循环消费任务，SSE 推事件。</span></div>
          <i>→</i>
          <div class="flow-step"><b>04</b><strong>回写</strong><span>判断候选态、工具轨迹与任务状态。</span></div>
          <i>→</i>
          <div class="flow-step"><b>05</b><strong>待验</strong><span>收件箱三列看板等人裁决。</span></div>
        </div>
        <p>队列是进程内的，不是分布式消息系统。这是刻意的：单机、小团队、可解释优先。代价是水平扩展需要重新设计，收益是没有额外基础设施要维护。</p>
      `
    },
    {
      id: "loop",
      num: "03",
      title: "单轮循环：模型决定下一步",
      html: `
        <p>每一轮都做同一件事：组装上下文 → 模型决策 → 执行一个或多个工具 → 回填结果 → 判断是否压缩、限流或收尾。没有固定工作流，只有可用工具与终止条件。</p>
        <ol>
          <li><b>组装。</b>系统提示、任务、工作区状态、三层记忆的检索结果、近期工具结果。</li>
          <li><b>决策。</b>模型选择直接回答，或调用一个工具；不允许一次生成一大段脚本绕开工具注册表。</li>
          <li><b>执行。</b>工具分发到具体实现；需要审批的走 HITL，被拒绝则把拒绝原因回填给模型。</li>
          <li><b>回填。</b>结果按策略截断或摘要，大对象落盘，只把可读部分放回上下文。</li>
          <li><b>收尾。</b>达到轮数上限、模型给出最终回答、任务被取消，或连续无进展。</li>
        </ol>
        <div class="callout warn">
          <span class="k">轮数上限</span>
          <p>主循环 40 轮，子代理 20 轮。上限不是性能参数，是失败可见性参数：与其让 agent 无限试错，不如在边界处停住，把未完成的活留在「待验」并说明卡在哪。</p>
        </div>
      `
    },
    {
      id: "tools",
      num: "04",
      title: "工具注册与权限",
      html: `
        <p>模型只能看到注册表里的工具。当前有 27 个绑定，覆盖论文检索、PDF 下载、按节阅读、笔记、领域、审批与上下文管理。<code>run_bash</code> 存在，但<strong>不在模型工具表里</strong>，只能经 HITL 审批触发。</p>
        <div class="dtable">
          <table>
            <thead><tr><th>层</th><th>例子</th><th>默认可见</th><th>边界</th></tr></thead>
            <tbody>
              <tr><td><b>论文</b></td><td><code>get_papers</code>、<code>paper_pdf_download</code>、<code>read_paper_section</code></td><td class="ok">是</td><td>全文只从 arXiv 来</td></tr>
              <tr><td><b>判断</b></td><td><code>save_item</code></td><td class="ok">是</td><td>只能写候选态</td></tr>
              <tr><td><b>扫描</b></td><td>关键词通道、前向 / 后向引用链</td><td class="ok">是</td><td>每次运行写回执</td></tr>
              <tr><td><b>上下文</b></td><td>压缩、记忆检索、todo 更新</td><td class="ok">是</td><td>两档压缩阈值</td></tr>
              <tr><td><b>系统</b></td><td><code>run_bash</code></td><td class="no">否</td><td>仅 HITL，不进模型表</td></tr>
            </tbody>
          </table>
        </div>
        <p>判断工具另有一条证据约束：<code>located=true</code> 时必须带一段逐字来自所述节的引句（12–300 字符、连续一段），发表与修改都按归一化规则对节正文校验；校验不过整条拒绝，并给模型可读的改法。领域会话里 <code>save_note</code> / <code>save_item</code> 写到的论文会自动挂进当前领域（<code>role=read</code>，已有角色不动）——否则论文只落在全局论文库，领域论文库与领域笔记里都看不到。</p>
        <p>权限不是靠提示词约束，而是靠注册表与审批层。模型不知道 <code>run_bash</code> 存在，就不会试图「找个办法执行命令」。这是把安全边界放在代码而不是语气里。</p>
      `
    },
    {
      id: "memory",
      num: "05",
      title: "三层记忆与两档压缩",
      html: `
        <p>「记得什么」比「上下文多长」更重要。三层记忆各管一件事：</p>
        <div class="split2" style="grid-template-columns:repeat(3,minmax(0,1fr))">
          <div class="panel">
            <span class="k">01 · NOTES</span>
            <h4>笔记检索</h4>
            <p>Chroma 向量索引，按任务语义召回组里已有的笔记与判断。</p>
          </div>
          <div class="panel">
            <span class="k">02 · PAPERS</span>
            <h4>论文元数据</h4>
            <p>标题、作者、标识、领域归属与阅读状态，决定「读没读过」。</p>
          </div>
          <div class="panel">
            <span class="k">03 · CONTEXT</span>
            <h4>上下文</h4>
            <p>当前任务的工具结果与轨迹，按 128K 窗口管理。</p>
          </div>
        </div>
        <p>上下文不是无限堆叠。70% 与 90% 是两档压缩阈值：70% 开始折叠早期工具结果，保留结论与出处；90% 强制压缩并丢弃可重新获取的中间产物。压缩后的内容仍然要能回答「依据是什么」，否则宁可让任务失败。</p>
        <div class="callout ok">
          <span class="k">可重取原则</span>
          <p>能重新下载的 PDF、能重新调用的接口结果，可以丢；判断、引句、节锚点不能丢。压缩策略按「可重取性」而不是「长度」排序。</p>
        </div>
      `
    },
    {
      id: "failure",
      num: "06",
      title: "失败与边界",
      html: `
        <p>系统假设失败是常态：网络会超时，OpenAlex 会 429，PDF 会缺页，模型会调错工具。架构的目标不是避免失败，而是让失败有位置可落。</p>
        <ul>
          <li><b>通道失败</b>写 <code>channel_runs</code>，记 <code>ok</code> / <code>fail</code> / <code>skip</code>，清单照常交付。</li>
          <li><b>工具失败</b>回填给模型，允许换路径；重复失败计入「无进展」判断。</li>
          <li><b>任务失败</b>停在待验，附失败原因与最后一步轨迹，不静默重试到天荒地老。</li>
          <li><b>进程重启</b>时 <code>queued</code> 任务自动恢复；运行中的任务标记为中断，等人决定是否重跑。</li>
        </ul>
        <p>这些机制在 <a href="./reliability.html">行为治理与失败可见性</a>里展开；架构图与部署拓扑在 <a href="./architecture-diagram.html">系统上下文与容器</a>里展开。</p>
      `
    },
    {
      id: "next",
      num: "07",
      title: "从哪里继续读",
      html: `
        <p>如果你关心「它为什么这样组织」，下一步读<a href="./architecture-diagram.html">系统上下文与容器</a>；如果你关心「它失败时怎么办」，读<a href="./reliability.html">行为治理与失败可见性</a>；如果你关心「人怎么参与」，读<a href="./usage-flow.html">一个人，一周，从交活到组会</a>。</p>
        <div class="pillrow">
          <li><b>代码边界</b> core 不依赖 backend</li>
          <li><b>任务边界</b> 落库再跑，不靠内存</li>
          <li><b>工具边界</b> 模型只见注册表</li>
          <li><b>失败边界</b> 停在待验，不静默吞掉</li>
        </div>
      `
    }
  ]
};

const roadmap = {
  slug: "roadmap",
  order: 3,
  section: "起点",
  sectionEn: "START",
  eyebrow: "STATUS · 03",
  titleLead: "现在缺什么，",
  titleGrad: "接下来做什么。",
  plainTitle: "已知限制与规划",
  lead:
    "主链路已经可用，工作区与扫描通道都接上了后端；最大的功能缺口是阅读页与 LaTeX 精确模式，最大的工程债是验证。这是一份面向使用者的现状清单，不是承诺表。",
  desc: "OpenAcademic 已知限制与规划：已落地能力、四个最大缺口、部署前必改项、验证债与刻意不做的边界。",
  card: "已落地、最大缺口、部署前必改与验证债。",
  updated: "2026-11-19",
  read: "9 分钟",
  status: "持续更新 · v1.1.1",
  facts: [
    { b: "4", s: "最大功能缺口" },
    { b: "12", s: "已落地能力" },
    { b: "v1.1.1", s: "当前版本 · 2026-11-19" }
  ],
  related: ["deployment", "reliability", "product-thesis"],
  sections: [
    {
      id: "status",
      num: "01",
      title: "一句话现状",
      html: `
        <p class="lead-in">从派活到回写，闭环已经能跑；1.1.0 把工作区与扫描接进主链，1.1.1 补上引句证据链与领域自动入库；从「人也能读」到「精确研究」，还差一层。</p>
        <div class="strip">
          <div><b>100%</b><span>主链路</span><em>可用</em></div>
          <div><b>100%</b><span>工作区</span><em>已接后端</em></div>
          <div><b>92%</b><span>扫描与引用链</span><em>双通道</em></div>
          <div><b>24%</b><span>阅读页</span><em>未完成</em></div>
        </div>
        <p>百分比是粗略进度，不是精确工期。它的作用是让访客一眼看出：主链已经能用，阅读体验仍是最大缺口。</p>
      `
    },
    {
      id: "shipped",
      num: "02",
      title: "已经落地",
      html: `
        <ul>
          <li><b>收件箱 / 本周清单 / 领域条目流</b>共用一份工作区状态，路由切换不丢操作。</li>
          <li><b>派活落库</b>：<code>tasks</code> + 进程内队列，重启后 <code>queued</code> 自动恢复。</li>
          <li><b>agent 发表判断</b>：精读时经 <code>save_item</code> 写入领域，候选态由人确认或推翻；<code>located=true</code> 必须带逐字引句。</li>
          <li><b>引句证据链</b>：发表 / 修改时按归一化规则在所称节正文里核对引句，<code>quote_verified=1</code> 才标「引句已核对」；徽章区分「引句已核对 / 仅节锚点 / 未定位」。</li>
          <li><b>领域自动入库</b>：领域会话里 <code>save_note</code> / <code>save_item</code> 写到的论文自动挂进领域（<code>role=read</code>，已有角色不动）。</li>
          <li><b>工作区真值重取</b>：进入主视图即重取工作区，会话续跑发表的判断不再等「确认采用」才出现在清单。</li>
          <li><b>已采用可回看</b>：收件箱「已处理 → 已采用」的条目带执行现场链接，采用后仍能回到那次派活的会话。</li>
          <li><b>关键词通道</b>：逐领域跑 arXiv，命中 / 失败 / 限流写 <code>channel_runs</code>。</li>
          <li><b>引用链通道</b>：OpenAlex 前向「本周谁引了种子」与后向「种子引了谁」。</li>
          <li><b>扫描候选</b>：落 <code>scan_candidates</code>，按领域 + 周 + 标识去重，可一键派活。</li>
          <li><b>三标识对齐</b>：arXiv → OpenAlex 实测 100/100，引用链本期做。</li>
          <li><b>pytest 覆盖</b>：记忆层、领域容器、上下文回收、工作区模型、引句契约、通道与 PDF 读取。</li>
        </ul>
        <div class="callout ok">
          <span class="k">可验证的说法</span>
          <p>以上能力都能在后端数据里找到对应表或字段；界面只是这些状态的视图。判断一个功能是否真的落地，先看它有没有状态落点，而不是看页面上有没有按钮。</p>
        </div>
      `
    },
    {
      id: "gaps",
      num: "03",
      title: "四个最大的缺口",
      html: `
        <p>这些不是小修小补，决定「读」能不能从 Agent 的工具调用，变成人也能操作的阅读与批注。</p>
        <div class="split2">
          <div class="panel warn">
            <span class="k">01 · READING</span>
            <h4>阅读页与分级阅读</h4>
            <p><code>/p/[projectId]/paper/[paperId]</code> 路由、L1 速览 / L2 精读 / L3 复现、<code>reading_level</code> 可写 UI、原文文档端点、高亮与批注、阅读进度、「精读才入库」门槛都还没有。</p>
          </div>
          <div class="panel warn">
            <span class="k">02 · LATEX</span>
            <h4>精确研究工具未注册</h4>
            <p>8 个基于 LaTeX 源码的精确工具（overview / outline / search / figures / tables / equations / references）写在代码里，但没注册进模型工具表，模型调不到。</p>
          </div>
          <div class="panel warn">
            <span class="k">03 · WORKSPACE</span>
            <h4>导入与笔记操作</h4>
            <p>本地 PDF 导入没有 multipart 端点；领域笔记页只读，没有新建、编辑与反链；跨领域笔记列表与向量召回也还没有。</p>
          </div>
          <div class="panel warn">
            <span class="k">04 · FRONTEND</span>
            <h4>搜索、编辑与长会话</h4>
            <p>会话历史没有全文搜索；笔记没有编辑能力；connect 回放没有分页；长会话的消息导航没有虚拟化。</p>
          </div>
        </div>
      `
    },
    {
      id: "deploy",
      num: "04",
      title: "部署前必改",
      html: `
        <p>内部小团队可以先跑；对公网开放前，至少把这四组事情处理掉。</p>
        <div class="dtable">
          <table>
            <thead><tr><th>事项</th><th>现状</th><th>要求</th></tr></thead>
            <tbody>
              <tr><td><b>默认管理员口令</b></td><td><code>admin@example.com / admin123</code> 写在源码里</td><td>首次登录立即改密</td></tr>
              <tr><td><b>账号开通</b></td><td>没有注册入口</td><td>管理员建号</td></tr>
              <tr><td><b>.secret_key</b></td><td>解密已存 API Key 的唯一钥匙</td><td>备份，不要重新生成</td></tr>
              <tr><td><b>依赖与发布门禁</b></td><td>部分检查未强制</td><td>lock 文件 / lint / typecheck</td></tr>
            </tbody>
          </table>
        </div>
        <div class="callout warn">
          <span class="k">公网前还要补的安全项</span>
          <p>Cookie 尚未设 <code>Secure</code>；会话令牌按明文存储；配置密文是 AES-CBC 无 MAC。应补 HTTPS、令牌哈希与 AES-GCM / HMAC。CORS 目前全开，登录也没有失败节流。</p>
        </div>
        <p>完整步骤见<a href="./deployment.html">服务器部署与升级</a>。CI 在 GitHub Actions，主仓在 Gitee；需要镜像或自建 runner。</p>
      `
    },
    {
      id: "verification",
      num: "05",
      title: "验证债",
      html: `
        <p>有些代码写完了，还没在真实环境里跑过。这些只能人工跑，按组一次跑完最省事。</p>
        <ul class="pillrow">
          <li>多用户隔离</li>
          <li>PDF 真样本页眉过滤</li>
          <li>领域 IA 23 条路由</li>
          <li>前端 IA：登录 → 交活 → 四态回写</li>
          <li>上下文回收 B1–B8</li>
          <li>一次真机精读端到端</li>
          <li>引句校验与 PATCH 矩阵</li>
          <li>LaTeX 产物与节边界一致性</li>
        </ul>
        <div class="callout">
          <span class="k">优先补测</span>
          <p><code>crypto_utils</code> 往返与 mask、<code>load_model_config</code> 合并优先级、<code>AgentState.update_todos</code> 的五种终止路径、<code>run_agent_stream</code> 的事件序列、多会话并发写入与断连续跑。</p>
        </div>
        <p>Agent 主循环、限流、笔记与后端路由目前没有自动化测试。验证债不是「质量不好」，是「还没有证据说它好」——在产品里，这两者的区别很重要。</p>
      `
    },
    {
      id: "notdoing",
      num: "06",
      title: "刻意不做",
      html: `
        <p>提 PR 前先对齐：有些东西不是没做，是决定不做。</p>
        <ul class="pillrow">
          <li class="no">每人自带 API Key（BYOK）</li>
          <li class="no">登录改 JWT</li>
          <li class="no">对话里直接建领域</li>
          <li class="no">删除论文的 UI 入口</li>
          <li class="no">run_bash 进模型工具表</li>
          <li class="no">统计持久化与历史回溯</li>
          <li class="no">会议纪要 / PPT / 外部日历</li>
          <li class="no">无界 todo 硬拒</li>
        </ul>
        <p>判断标准见<a href="./product-thesis.html">产品主旨</a>：是否强化「判断—出处—轨迹」主链。</p>
      `
    },
    {
      id: "next",
      num: "07",
      title: "接下来往哪走",
      html: `
        <p>方向不是「更聪明的模型」，而是模型越强越值钱的资产：证据链、轨迹轴、通道运行记录。</p>
        <div class="dtable">
          <table>
            <thead><tr><th>方向</th><th>落点</th><th>为什么现在做</th></tr></thead>
            <tbody>
              <tr><td><b>可追溯综述</b></td><td><code>paper_id + section + quote</code></td><td>单条引句已落地，差聚合与排版</td></tr>
              <tr><td><b>评估</b></td><td>citation precision / hallucination rate</td><td>没有指标就无法证明「可核对」</td></tr>
              <tr><td><b>多源检索与图谱</b></td><td>Semantic Scholar / PubMed / 引文图谱</td><td>单 arXiv 覆盖不了邻近工作</td></tr>
              <tr><td><b>RAG</b></td><td>可配置嵌入 / rerank / 来源标注</td><td>笔记检索已有索引，缺可调参数</td></tr>
              <tr><td><b>产出</b></td><td>LaTeX / BibTeX / Word / PDF</td><td>判断要进稿子，不能只停在界面</td></tr>
            </tbody>
          </table>
        </div>
        <blockquote>目标不是完美召回，是让漏检可归因。</blockquote>
      `
    }
  ]
};

export default [productThesis, architecture, roadmap].map((doc, i) => ({ ...doc, order: i + 1 }));
