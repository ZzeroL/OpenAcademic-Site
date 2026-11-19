const architectureDiagram = {
  slug: "architecture-diagram",
  order: 4,
  section: "机制",
  sectionEn: "MECHANISM",
  eyebrow: "ARCHITECTURE MAP · 04",
  titleLead: "系统上下文、容器，",
  titleGrad: "与一次请求的路径。",
  plainTitle: "系统上下文与容器",
  lead:
    "把系统拆成四层来看：谁在用、由哪些运行单元组成、Agent 单轮里有哪些组件、一次派活如何穿过它们。图是示意，链路与工具名取自真实实现。",
  desc: "OpenAcademic 系统上下文、容器、后端组件、Agent 单轮循环、记忆与数据模型、部署拓扑和请求时序。",
  card: "上下文、容器、组件、部署拓扑与请求时序。",
  updated: "2026-11-19",
  read: "8 分钟",
  status: "已发布",
  facts: [
    { b: "5", s: "运行容器" },
    { b: "6", s: "核心组件" },
    { b: "2", s: "外部数据源" }
  ],
  related: ["architecture", "deployment", "workspace-data-model"],
  sections: [
    {
      id: "context",
      num: "01",
      title: "系统上下文：谁在用，连了什么",
      html: `
        <p>OpenAcademic 是一个<strong>单机可自部署</strong>的研究生产线。系统边界内是 Agent、工作区数据与界面；边界外只有三类依赖：模型端点、arXiv 全文、OpenAlex 引用。</p>
        <div class="flow vert">
          <div class="flow-step"><b>ACTOR</b><strong>研究者 / 组内成员</strong><span>交一句话、确认判断、开组会、勾四态。</span></div>
          <i>↓</i>
          <div class="flow-step"><b>SYSTEM</b><strong>OpenAcademic</strong><span>收件箱、清单、领域条目、扫描通道、Agent 内核。</span></div>
          <i>↓</i>
          <div class="flow-step"><b>EXTERNAL</b><strong>OpenAI 兼容端点 · arXiv · OpenAlex</strong><span>推理、全文与引用；对不上会显式上清单，不猜。</span></div>
        </div>
        <p>没有账号体系之外的 SaaS 依赖，没有外部消息队列，没有托管数据库。数据根在 <code>&lt;repo&gt;/.openacademic/</code>，生产环境用 <code>OPENACADEMIC_HOME</code> 指到代码目录之外。</p>
      `
    },
    {
      id: "containers",
      num: "02",
      title: "容器：五个运行单元",
      html: `
        <div class="dtable">
          <table>
            <thead><tr><th>容器</th><th>职责</th><th>技术</th><th>不做什么</th></tr></thead>
            <tbody>
              <tr><td><b>Web</b></td><td>收件箱、清单、领域工作台</td><td>Next.js 16 + CopilotKit</td><td>不直接访问模型或数据库</td></tr>
              <tr><td><b>Backend</b></td><td>登录、会话归属、SSE、工作区路由</td><td>FastAPI</td><td>不实现 Agent 循环</td></tr>
              <tr><td><b>Core</b></td><td>单轮循环、工具、记忆、扫描</td><td>Python 包</td><td>不反向依赖 backend</td></tr>
              <tr><td><b>Storage</b></td><td>关系数据、向量索引、论文文件</td><td>SQLite + Chroma + 目录</td><td>不做外部同步</td></tr>
              <tr><td><b>Runner</b></td><td>启动、建库、播种管理员</td><td><code>start.mjs</code></td><td>不在服务器上编译前端</td></tr>
            </tbody>
          </table>
        </div>
        <p>CLI 是 Core 的第二种外壳，和 Web 共用工具、记忆与上下文管理。它不经过 Backend，因此可以作为最小可验证路径：当 Web 出问题时，CLI 仍能证明内核是否正常。</p>
      `
    },
    {
      id: "components",
      num: "03",
      title: "组件：Agent 单轮里有什么",
      html: `
        <div class="split2">
          <div class="panel">
            <span class="k">01 · LOOP</span>
            <h4>单轮循环</h4>
            <p>组装上下文 → 模型决策 → 工具调用 → 结果回填 → 压缩/限流 → 继续或收尾。主循环 40 轮。</p>
          </div>
          <div class="panel">
            <span class="k">02 · REGISTRY</span>
            <h4>工具注册表</h4>
            <p>27 个绑定；模型只见注册表。需要审批的工具单独走 HITL，<code>run_bash</code> 不在表内。</p>
          </div>
          <div class="panel">
            <span class="k">03 · MEMORY</span>
            <h4>三层记忆</h4>
            <p>笔记检索、论文元数据、当前上下文。压缩按「可重取性」排序。</p>
          </div>
          <div class="panel">
            <span class="k">04 · SCAN</span>
            <h4>扫描通道</h4>
            <p>关键词、前向引用、后向引用；每次运行写 <code>channel_runs</code>。</p>
          </div>
          <div class="panel">
            <span class="k">05 · HITL</span>
            <h4>审批层</h4>
            <p>请求、批准、拒绝、超时都有事件；拒绝理由回填给模型。</p>
          </div>
          <div class="panel">
            <span class="k">06 · TRAJECTORY</span>
            <h4>轨迹轴</h4>
            <p>判断的起草、确认、推翻、搁置 append-only；理由必填。</p>
          </div>
        </div>
        <p>组件之间通过显式的数据结构连接，而不是共享可变全局状态。这让「一次任务停在哪」可以从事件与表里复原。</p>
      `
    },
    {
      id: "data",
      num: "04",
      title: "记忆与数据模型",
      html: `
        <p>从外部看，只需要记住四组数据：<strong>论文</strong>、<strong>判断</strong>、<strong>任务</strong>、<strong>运行回执</strong>。领域是它们的归属维度，轨迹轴是判断的变更日志。</p>
        <div class="flow">
          <div class="flow-step"><b>INPUT</b><strong>任务</strong><span><code>tasks</code> + 队列；重启恢复 queued。</span></div>
          <i>→</i>
          <div class="flow-step"><b>SOURCE</b><strong>论文</strong><span>arXiv 元数据、PDF、节边界。</span></div>
          <i>→</i>
          <div class="flow-step"><b>JUDGMENT</b><strong>判断</strong><span><code>items</code> + 候选态 + 出处。</span></div>
          <i>→</i>
          <div class="flow-step"><b>CHANGE</b><strong>轨迹</strong><span>append-only，理由必填。</span></div>
          <i>→</i>
          <div class="flow-step"><b>RECEIPT</b><strong>回执</strong><span><code>channel_runs</code> + <code>scan_candidates</code>。</span></div>
        </div>
        <p>字段、索引与只读视图见<a href="./workspace-data-model.html">工作区数据模型</a>；候选去重见<a href="./scan-candidates.html">候选落表与一键派活</a>。</p>
      `
    },
    {
      id: "deploy",
      num: "05",
      title: "部署拓扑",
      html: `
        <div class="flow vert">
          <div class="flow-step"><b>EDGE</b><strong>Nginx</strong><span>TLS、反代、静态产物。</span></div>
          <i>↓</i>
          <div class="flow-step"><b>APP</b><strong>systemd: frontend / backend</strong><span>前端只跑 CI 产物；后端跑 FastAPI。</span></div>
          <i>↓</i>
          <div class="flow-step"><b>DATA</b><strong>OPENACADEMIC_HOME</strong><span>SQLite、Chroma、论文文件、<code>.secret_key</code>。</span></div>
          <i>↓</i>
          <div class="flow-step"><b>CI</b><strong>GitHub Actions</strong><span>出前端包，服务器下载后切换 release。</span></div>
        </div>
        <p>服务器上不编译前端，是为了让发布与构建解耦：回滚只需切目录，不需要重新装依赖。停机与回滚步骤见<a href="./deployment.html">服务器部署与升级</a>。</p>
      `
    },
    {
      id: "sequence",
      num: "06",
      title: "一次派活的请求时序",
      html: `
        <p>以「读 LooGLE 那篇，出节级笔记」为例，一次成功请求大致经过：</p>
        <ol>
          <li><b>Web</b> 提交一句话与领域，调用 Backend 的任务接口。</li>
          <li><b>Backend</b> 写入 <code>tasks</code>，返回任务 ID；此时前端可以刷新或离开。</li>
          <li><b>Runner</b> 从队列取出任务，启动 <code>core</code> 的 Agent 循环。</li>
          <li><b>Core</b> 调 <code>get_papers</code> 检索，<code>paper_pdf_download</code> 下载，<code>read_paper_section</code> 按节读。</li>
          <li><b>Core</b> 经 <code>save_item</code> 写入候选判断（引句先在所称节里逐字核对）；轨迹轴记录起草事件。</li>
          <li><b>Backend</b> 通过 SSE 推进度事件；任务完成，状态变为待验。</li>
          <li><b>Web</b> 收件箱三列看板刷新，出现「条目 × 4 · 待验」。</li>
        </ol>
        <div class="callout">
          <span class="k">关键点</span>
          <p>第 2 步之后，任务就不再依赖浏览器连接。断线只影响界面刷新，不影响执行；这也是「不是聊天框」在架构上的体现。</p>
        </div>
      `
    },
    {
      id: "read",
      num: "07",
      title: "怎么读这些图",
      html: `
        <p>先看依赖方向，再看状态落点，最后看失败路径。一个组件如果既不写状态、也不影响失败可见性，它多半不承重。</p>
        <div class="pillrow">
          <li><b>上下文图</b> 回答「边界在哪」</li>
          <li><b>容器图</b> 回答「部署什么」</li>
          <li><b>组件图</b> 回答「循环怎么转」</li>
          <li><b>时序图</b> 回答「断线怎么办」</li>
        </div>
      `
    }
  ]
};

const reliability = {
  slug: "reliability",
  order: 5,
  section: "机制",
  sectionEn: "MECHANISM",
  eyebrow: "RELIABILITY · 05",
  titleLead: "让失败有位置，",
  titleGrad: "让清单照常交付。",
  plainTitle: "行为治理与失败可见性",
  lead:
    "限流三层、上下文分层压缩、工具结果策略、HITL 审批，以及哪些失败必须显式上界面。可靠性不是「永不失败」，而是失败之后系统还知道自己在哪一步。",
  desc: "OpenAcademic 行为治理：三层限流、两档上下文压缩、工具结果策略、HITL 审批与失败可见性矩阵。",
  card: "限流、压缩、工具结果与失败可见性。",
  updated: "2026-11-19",
  read: "9 分钟",
  status: "已发布",
  facts: [
    { b: "3", s: "限流层" },
    { b: "70 / 90", s: "两档压缩阈值" },
    { b: "3", s: "通道回执状态" }
  ],
  related: ["architecture", "scan-candidates", "roadmap"],
  sections: [
    {
      id: "throttle",
      num: "01",
      title: "限流三层",
      html: `
        <p>限流不是单点配置，而是三层预算。每层解决不同的问题：入口防挤占、循环防无限试错、工具防外部接口被打爆。</p>
        <div class="dtable">
          <table>
            <thead><tr><th>层</th><th>限制什么</th><th>超限后的行为</th></tr></thead>
            <tbody>
              <tr><td><b>入口层</b></td><td>同时运行的任务数与单用户并发</td><td>新任务留在 <code>queued</code>，不丢、不静默拒绝</td></tr>
              <tr><td><b>循环层</b></td><td>主循环 40 轮、子代理 20 轮</td><td>停在待验，附最后一步与未完成原因</td></tr>
              <tr><td><b>工具层</b></td><td>单工具重试与外部接口节流</td><td>记失败并回填；连续无进展则收尾</td></tr>
            </tbody>
          </table>
        </div>
        <p>三层限流的共同目标是<strong>把任务送到一个可解释的终点</strong>，而不是让它无声地消失。排队中的任务可见，超轮数的任务可见，工具失败也可见。</p>
        <div class="callout">
          <span class="k">参数口径</span>
          <p>具体阈值以仓库配置为准；本页只描述分层与超限行为。调整参数不应改变「超限必须留下状态」这条约束。</p>
        </div>
      `
    },
    {
      id: "compression",
      num: "02",
      title: "上下文分层压缩",
      html: `
        <p>上下文窗口 128K。70% 与 90% 是两档阈值，不是两个开关：</p>
        <div class="split2">
          <div class="panel">
            <span class="k">70% · FOLD</span>
            <h4>折叠早期工具结果</h4>
            <p>保留结论、出处与关键引句；把完整 PDF 段落替换为可重新读取的引用。目标是释放空间但不丢证据。</p>
          </div>
          <div class="panel">
            <span class="k">90% · FORCE</span>
            <h4>强制压缩并丢弃中间产物</h4>
            <p>可重新获取的下载内容、重复的搜索结果直接丢弃；判断、节锚点与引句不能丢。丢不起就失败。</p>
          </div>
        </div>
        <p>压缩按「可重取性」排序，而不是按消息新旧排序。一条很旧的判断比一份刚下载的 PDF 更值得保留，因为后者可以再取一次，前者一旦丢了就只剩模型的记忆。</p>
        <div class="callout warn">
          <span class="k">禁止项</span>
          <p>不得在压缩时「顺手补全」节号或引句。压缩只能缩短依据，不能生成依据；无法保留出处时，应显式标记未定位。</p>
        </div>
      `
    },
    {
      id: "toolresults",
      num: "03",
      title: "工具结果策略",
      html: `
        <p>工具返回的内容分三类处理：</p>
        <ul>
          <li><b>可读结果</b>（检索命中、节文本）按长度截断，保留首尾与命中段落。</li>
          <li><b>大对象</b>（PDF、图表、LaTeX 源码）落盘，上下文只放路径与摘要。</li>
          <li><b>状态结果</b>（成功 / 失败 / 跳过）必须结构化，不能被当成自然语言文本随意改写。</li>
        </ul>
        <p>结构化状态是失败可见性的基础。如果工具失败被模型改写成「没有找到相关内容」，人看到的就是一次正常的空结果——这比失败更糟。</p>
        <div class="claim">
          <div class="claim-top"><span class="k">状态回执 · 示意</span><span class="state">channel_runs</span></div>
          <p class="claim-t">openalex_backward 本周未完成：OpenAlex 返回 429，通道记 skip，清单照常交付。</p>
          <div class="claim-src"><span class="claim-id">status = skip</span><span class="claim-sec">retry = next_week</span><span class="claim-sec">receipt = 可见</span></div>
          <p class="claim-quote">失败不是「清单里少几条」，而是「清单里明确写着哪条没跑」。</p>
        </div>
      `
    },
    {
      id: "hitl",
      num: "04",
      title: "HITL 审批",
      html: `
        <p>人机协同审批只用于「模型不该自己决定」的动作。当前最典型的是 <code>run_bash</code>：它存在，但不注册进模型工具表，只能经审批层触发。</p>
        <div class="flow">
          <div class="flow-step"><b>01</b><strong>请求</strong><span>模型提出需要执行的动作与理由。</span></div>
          <i>→</i>
          <div class="flow-step"><b>02</b><strong>挂起</strong><span>任务进入等待，界面显示待审批。</span></div>
          <i>→</i>
          <div class="flow-step"><b>03</b><strong>裁决</strong><span>批准 / 拒绝 / 超时。</span></div>
          <i>→</i>
          <div class="flow-step"><b>04</b><strong>回填</strong><span>结果或拒绝理由回到上下文。</span></div>
        </div>
        <p>审批不是「确认弹窗」，而是任务状态的一部分：挂起期间不能继续其他工具调用，避免模型在等待时绕路执行。拒绝理由必须可读，否则模型只会重复请求。</p>
      `
    },
    {
      id: "visibility",
      num: "05",
      title: "失败可见性矩阵",
      html: `
        <p>哪些失败必须上界面，哪些可以只留在日志里，按「人是否需要据此改动作」判断。</p>
        <div class="dtable">
          <table>
            <thead><tr><th>失败</th><th>状态落点</th><th>界面可见</th><th>人应该做什么</th></tr></thead>
            <tbody>
              <tr><td><b>通道 429 / 超时</b></td><td><code>channel_runs.status</code></td><td class="ok">是</td><td>下周重跑，或换源</td></tr>
              <tr><td><b>PDF 缺页 / 节边界异常</b></td><td>工具结果 + 判断标记</td><td class="ok">是</td><td>换版本或人工核对</td></tr>
              <tr><td><b>引句定位失败</b></td><td>「未定位」</td><td class="ok">是</td><td>不可直接引用</td></tr>
              <tr><td><b>引句校验不通过</b></td><td><code>invalid_args</code> + 该节开头</td><td class="ok">是（回给模型）</td><td>按原文重发，不落库</td></tr>
              <tr><td><b>任务超轮数</b></td><td>待验 + 最后一步</td><td class="ok">是</td><td>拆小任务重派</td></tr>
              <tr><td><b>单次工具重试</b></td><td>工具轨迹</td><td class="no">否</td><td>无需动作</td></tr>
              <tr><td><b>内部调试日志</b></td><td>日志文件</td><td class="no">否</td><td>无需动作</td></tr>
            </tbody>
          </table>
        </div>
        <p>注意最后两行：不是所有失败都要打扰人。可见性的门槛是「它是否改变判断或下一步动作」。</p>
      `
    },
    {
      id: "recovery",
      num: "06",
      title: "可恢复性",
      html: `
        <p>系统假设进程会重启、连接会断、浏览器会关。恢复策略按状态区分：</p>
        <ul>
          <li><b>queued</b>：重启后自动恢复，重新入队。</li>
          <li><b>running</b>：标记为中断，不自动重跑；等人确认后重新派活，避免重复写入判断。</li>
          <li><b>awaiting_review</b>：保持不变，继续待在待验列。</li>
          <li><b>done</b>：不回滚；如需修改，走推翻与再确认。</li>
        </ul>
        <p>不自动重跑 running 是一个产品决定：重复执行可能产生重复候选，破坏「判断的变更日志」。宁可让人多点一次，也不让轨迹出现无法解释的分叉。</p>
      `
    },
    {
      id: "audit",
      num: "07",
      title: "回执、轨迹与观测",
      html: `
        <p>三类记录构成可观测性：</p>
        <div class="dtable">
          <table>
            <thead><tr><th>记录</th><th>回答的问题</th><th>粒度</th></tr></thead>
            <tbody>
              <tr><td><b><code>channel_runs</code></b></td><td>这周哪条通道跑了、哪条没跑、为什么</td><td>每次运行</td></tr>
              <tr><td><b>工具轨迹</b></td><td>这一步用了什么、返回了什么</td><td>每次调用</td></tr>
              <tr><td><b>轨迹轴</b></td><td>这条判断为什么确认或推翻</td><td>每次变更</td></tr>
            </tbody>
          </table>
        </div>
        <p>它们共同支撑「漏检可归因」。没有这三类记录，系统只能证明自己输出了什么，不能证明自己没读到什么。</p>
        <div class="callout ok">
          <span class="k">可靠性判据</span>
          <p>一次失败之后，人能否在界面上回答三个问题：哪一步失败、失败影响了什么、下一步该做什么。能回答，失败就是可控的。</p>
        </div>
      `
    }
  ]
};

const usageFlow = {
  slug: "usage-flow",
  order: 966,
  section: "机制",
  sectionEn: "MECHANISM",
  eyebrow: "USAGE FLOW · 06",
  titleLead: "一个人，一周，",
  titleGrad: "从交活到组会。",
  plainTitle: "一个人，一周，从交活到组会",
  lead:
    "周三交一句话，周一看清单，组会讨论，会后勾四态。人一周只有四个动作；其余时间它在扫通道、读论文、写候选判断。",
  desc: "OpenAcademic 一周使用流程：周三派活、周一收清单、组会裁决、会后勾四态，以及人的四个动作。",
  card: "周三一句话，周一收清单，会后勾四态。",
  updated: "2026-11-19",
  read: "7 分钟",
  status: "已发布",
  facts: [
    { b: "4", s: "人的一周动作" },
    { b: "4", s: "阅读四态" },
    { b: "2 天", s: "组会前状态线" }
  ],
  related: ["product-thesis", "frontend-ia", "scan-candidates"],
  sections: [
    {
      id: "wednesday",
      num: "01",
      title: "周三：交一句话",
      html: `
        <p>不选关键词、不挑论文、不配检索式。你只需要说清楚<strong>想弄明白什么</strong>，以及它属于哪个领域。</p>
        <div class="codeblock">
          <div class="bar"><span class="lamp"><i class="r"></i><i class="y"></i><i class="g"></i></span><span>inbox / compose</span></div>
          <pre><span class="p">▸</span> 读 LooGLE 那篇，出节级笔记，重点看长依赖
<span class="c">领域</span> 长上下文大语言模型
<span class="c">动作</span> 派出去 → tasks: queued</pre>
        </div>
        <p>一句话派活的关键不是自然语言多漂亮，而是任务落库：刷新、断线、重启都不会丢。你交完就可以离开，不需要守着对话框。</p>
        <div class="callout">
          <span class="k">写一句话的建议</span>
          <p>写「要什么判断」比写「读哪几篇」更有用。读哪几篇、按什么顺序，归 agent 自己定；你只需要说清楚交付物长什么样。</p>
        </div>
      `
    },
    {
      id: "thursday",
      num: "02",
      title: "周四到周日：它自己跑",
      html: `
        <p>这段时间你不需要参与。系统按任务与周窗口做三件事：扫通道、读论文、写候选判断。</p>
        <div class="flow">
          <div class="flow-step"><b>SCAN</b><strong>三通道</strong><span>关键词 + 前向 / 后向引用，写回执。</span></div>
          <i>→</i>
          <div class="flow-step"><b>PICK</b><strong>候选去重</strong><span>领域 + 周 + 标识；派过的跨周不再入库。</span></div>
          <i>→</i>
          <div class="flow-step"><b>READ</b><strong>按节精读</strong><span>检索、下载、逐节读，工具轨迹可见。</span></div>
          <i>→</i>
          <div class="flow-step"><b>WRITE</b><strong>候选判断</strong><span><code>save_item</code> 落库，不直接定稿。</span></div>
          <i>→</i>
          <div class="flow-step"><b>STOP</b><strong>待验</strong><span>干完的活停在收件箱，不自动采用。</span></div>
        </div>
        <p>「干完待验」是流程的核心停顿点。它把模型的产出挡在人面前，而不是直接混进领域条目。没有这个停顿，后面的确认与轨迹就失去意义。</p>
      `
    },
    {
      id: "monday",
      num: "03",
      title: "周一：收本周清单",
      html: `
        <p>清单不是论文列表，而是<strong>本周判断 + 覆盖情况</strong>。打开时先看状态线：距组会几天、几条决定待确认、几条干完待验。</p>
        <div class="glass" style="margin-top:22px">
          <div class="glass-top"><span class="dots"><i class="r"></i><i class="y"></i><i class="g"></i></span><span class="glass-label">digest / week</span><span class="glass-badge">示意</span></div>
          <div class="glass-body">
            <div class="board">
              <div class="board-row"><span class="board-name">本周判断</span><span class="board-meta ok">12 条</span><span class="bar"><i style="width:100%"></i></span><span class="pct">4 领域</span></div>
              <div class="board-row"><span class="board-name">粗筛未读</span><span class="board-meta wip">17 篇</span><span class="bar"><i class="wip" style="width:34%"></i></span><span class="pct">附理由</span></div>
              <div class="board-row"><span class="board-name">扫描候选</span><span class="board-meta">15 篇</span><span class="bar"><i style="width:40%"></i></span><span class="pct">已派 6</span></div>
              <div class="board-row"><span class="board-name">通道异常</span><span class="board-meta wip">1 条</span><span class="bar"><i class="wip" style="width:12%"></i></span><span class="pct">429</span></div>
            </div>
          </div>
        </div>
        <p>清单回答四个问题：这周判了什么、依据是什么、哪些没读、哪条通道没跑。它不追求把 17 篇未读读完，而是让你知道为什么没读。</p>
      `
    },
    {
      id: "meeting",
      num: "04",
      title: "组会：确认或推翻",
      html: `
        <p>组会上讨论的不是「这个答案像不像」，而是「这条判断要不要采用」。每条候选都带着 ID、节与已核对引句，讨论可以直接落到原文；「复制引用」能把「判断 + 题录 + 节 + 引句」整块贴进纪要。</p>
        <div class="split2">
          <div class="panel">
            <span class="k">CONFIRM</span>
            <h4>确认采用</h4>
            <p>判断进入领域条目，可用于稿子与综述；轨迹轴记录确认人与时间。</p>
          </div>
          <div class="panel">
            <span class="k">OVERTURN</span>
            <h4>推翻重跑</h4>
            <p>理由必填；agent 先替你起草理由，你只改。推翻后原判断保留，不删除。</p>
          </div>
        </div>
        <p>组会不负责「让模型再多写一点」。需要补证时，正确动作是退回重跑或新建一个更窄的任务，而不是在对话框里继续追问——后者不会落到轨迹轴。</p>
        <div class="claim">
          <div class="claim-top"><span class="k">本周决定 · 示意</span><span class="state">agent 起草 · 待确认</span></div>
          <p class="claim-t">本周不深读新论文，先把 3 篇种子补齐节级引句。</p>
          <div class="claim-src"><span class="claim-id">依据 3 条已确认</span><span class="claim-sec">11-09</span></div>
          <div class="claim-foot"><span>确认 / 修改 / 推翻</span><span>推翻时 <b>理由必填</b></span></div>
        </div>
      `
    },
    {
      id: "after",
      num: "05",
      title: "会后：勾四态",
      html: `
        <p>组会结束后，给每篇相关论文勾一个阅读状态。四态不是评分，是下一步动作：</p>
        <div class="dtable">
          <table>
            <thead><tr><th>状态</th><th>含义</th><th>下一步</th></tr></thead>
            <tbody>
              <tr><td><b>未读</b></td><td>还没进入阅读队列</td><td>留在候选池或粗筛</td></tr>
              <tr><td><b>粗筛</b></td><td>L1 速览：看摘要、图表与结论</td><td>决定是否进入精读</td></tr>
              <tr><td><b>精读</b></td><td>L2：按节阅读，写判断与引句</td><td>进入条目与组会讨论</td></tr>
              <tr><td><b>复现</b></td><td>L3：复现实验或核对数值</td><td>产出可引用证据</td></tr>
            </tbody>
          </table>
        </div>
        <p>勾四态的意义在于把「读没读」从口头承诺变成可见状态。粗筛未读要附一句不读的理由；精读才入库，避免把速览印象当成结论。</p>
        <div class="callout warn">
          <span class="k">现状</span>
          <p>阅读页与四态的可写 UI 仍在路线图中（见<a href="./roadmap.html">已知限制</a>）。当前四态主要作为流程约定与数据字段存在，完整交互尚未落地。</p>
        </div>
      `
    },
    {
      id: "four-actions",
      num: "06",
      title: "人的四个动作",
      html: `
        <div class="pillars">
          <div class="pillar"><b>01 · ASK</b><h4>交一句话</h4><p>说清要什么判断，不说怎么检索。</p></div>
          <div class="pillar"><b>02 · RULE</b><h4>确认或推翻</h4><p>对候选判断做裁决，理由入轨迹。</p></div>
          <div class="pillar"><b>03 · MEET</b><h4>开组会</h4><p>带着出处讨论，不靠记忆复述。</p></div>
          <div class="pillar"><b>04 · MARK</b><h4>勾四态</h4><p>把读没读变成可见状态。</p></div>
        </div>
        <p>除此之外的动作——选关键词、挑论文、配检索式、追问模型、整理引用格式——都应该由系统承担或至少不成为主流程。人的时间应该花在判断上，而不是操作上。</p>
      `
    },
    {
      id: "week",
      num: "07",
      title: "一周状态表",
      html: `
        <div class="dtable">
          <table>
            <thead><tr><th>时间</th><th>系统</th><th>人</th><th>产物</th></tr></thead>
            <tbody>
              <tr><td><b>周三</b></td><td>任务落库、排队</td><td>交一句话</td><td><code>tasks.queued</code></td></tr>
              <tr><td><b>周四–周日</b></td><td>扫描、精读、写候选</td><td>不参与</td><td>候选判断 + 回执</td></tr>
              <tr><td><b>周一</b></td><td>生成本周清单</td><td>浏览状态线与清单</td><td>待确认 / 待验</td></tr>
              <tr><td><b>组会</b></td><td>展示出处与依据</td><td>确认或推翻</td><td>轨迹轴事件</td></tr>
              <tr><td><b>会后</b></td><td>记录四态</td><td>勾四态</td><td>阅读状态</td></tr>
            </tbody>
          </table>
        </div>
        <p>如果某一周没有组会，流程仍然成立：清单可以只作为个人周报，确认与推翻照样留痕。</p>
      `
    }
  ]
};

const frontendIa = {
  slug: "frontend-ia",
  order: 7,
  section: "机制",
  sectionEn: "MECHANISM",
  eyebrow: "FRONTEND IA · 07",
  titleLead: "收件箱、清单与领域：",
  titleGrad: "三条主路由。",
  plainTitle: "收件箱、清单与领域",
  lead:
    "前端不是聊天框加侧栏，而是三个共享同一份工作区状态的主路由。路由决定人先看到什么，数据契约决定页面能承诺什么。",
  desc: "OpenAcademic 前端信息架构：/inbox、/digest、/p/[projectId]/items 的路由、跳转规则与后端数据契约。",
  card: "三条主路由、跳转规则与后端数据契约。",
  updated: "2026-11-19",
  read: "8 分钟",
  status: "已发布",
  facts: [
    { b: "3", s: "主路由" },
    { b: "23", s: "领域 IA 路由" },
    { b: "1", s: "共享工作区状态" }
  ],
  related: ["usage-flow", "workspace-data-model", "roadmap"],
  sections: [
    {
      id: "routes",
      num: "01",
      title: "三条主路由",
      html: `
        <div class="dtable routes">
          <table>
            <thead><tr><th>路由</th><th>回答的问题</th><th>主要数据</th><th>状态</th></tr></thead>
            <tbody>
              <tr><td>/inbox</td><td>今天欠什么？</td><td>状态线、三列看板、本周决定</td><td class="ok">可用</td></tr>
              <tr><td>/digest</td><td>这周判了什么、漏了什么？</td><td>判断、粗筛未读、候选、通道异常</td><td class="ok">可用</td></tr>
              <tr><td>/p/[projectId]/items</td><td>这个领域现在知道什么？</td><td>领域条目流、判断状态与出处</td><td class="ok">已接后端</td></tr>
              <tr><td>/p/[projectId]/paper/[paperId]</td><td>这篇原文里依据在哪？</td><td>PDF 文档端点、节锚点、高亮</td><td class="no">路线图</td></tr>
            </tbody>
          </table>
        </div>
        <p>前三条路由共用一份工作区状态，但状态不靠前端缓存续命：每次进入主视图都会按后端重取一次，切回来看到的是当前真值。这也是为什么会话里续跑发表的判断能在回到清单时立刻出现，而不是等「确认采用」触发刷新。在清单里派活，回到收件箱同样能立刻看到任务卡。路由是视图，不是数据边界。</p>
      `
    },
    {
      id: "inbox",
      num: "02",
      title: "/inbox：先给状态，再给输入",
      html: `
        <p>收件箱的首屏不是输入框，而是状态线。它只说三件事：<strong>距组会几天、几条决定待确认、几条干完待验</strong>。扫一眼就知道今天欠什么。</p>
        <ul>
          <li><b>状态线</b>：时间压力 + 待处理数量，不展示无关统计。</li>
          <li><b>派活框</b>：一句话 + 领域选择，不做复杂表单。</li>
          <li><b>本周决定</b>：agent 起草，人只裁决；推翻理由 agent 先起草。</li>
          <li><b>三列看板</b>：派出的活 / 进行中 / 干完待验；进行中显示工具轨迹。</li>
          <li><b>已处理回看</b>：已采用的条目带「回看执行」链接，直接回到那次派活的会话。</li>
          <li><b>清单摘要</b>：判断、粗筛未读、候选、通道异常四个数，点开进 /digest。</li>
        </ul>
        <p>这些区块的顺序是产品判断：先告诉你欠什么，再让你加活。很多工具反过来，先给输入框，再让人自己记住上下文。</p>
      `
    },
    {
      id: "digest",
      num: "03",
      title: "/digest：覆盖情况比数量重要",
      html: `
        <p>本周清单不是论文排行榜，而是覆盖报告。它至少包含四组数据：</p>
        <div class="split2">
          <div class="panel">
            <span class="k">JUDGMENTS</span>
            <h4>本周判断</h4>
            <p>按领域分组，标出候选 / 确认 / 推翻 / 搁置；每条可回原文。</p>
          </div>
          <div class="panel">
            <span class="k">UNREAD</span>
            <h4>粗筛未读</h4>
            <p>每篇附一句不读的理由，避免「没读」变成隐形状态。</p>
          </div>
          <div class="panel">
            <span class="k">CANDIDATES</span>
            <h4>扫描候选</h4>
            <p>共多少、已派多少、未派多少；可一键派给 agent。</p>
          </div>
          <div class="panel">
            <span class="k">CHANNELS</span>
            <h4>通道异常</h4>
            <p>哪条通道 <code>skip</code> / <code>fail</code>，原因与下周是否重跑。</p>
          </div>
        </div>
        <p>清单可以交付「不完整」的结果，但不能交付「不知道哪里不完整」的结果。这是页面与数据的共同责任。</p>
      `
    },
    {
      id: "items",
      num: "04",
      title: "/p/[projectId]/items：领域条目流",
      html: `
        <p>领域是判断的归属维度，不是文件夹。条目流展示这个领域当前「知道什么」，每条判断带状态、出处与变更记录。</p>
        <div class="flow">
          <div class="flow-step"><b>FILTER</b><strong>按状态</strong><span>候选 / 确认 / 推翻 / 搁置。</span></div>
          <i>→</i>
          <div class="flow-step"><b>READ</b><strong>按条目</strong><span>判断 + ID + 节锚点 + 引句。</span></div>
          <i>→</i>
          <div class="flow-step"><b>TRACE</b><strong>按轨迹</strong><span>谁起草、谁确认、为什么改。</span></div>
          <i>→</i>
          <div class="flow-step"><b>ACT</b><strong>裁决</strong><span>确认 / 推翻 / 搁置，理由必填。</span></div>
        </div>
        <p>条目按证据等级显示徽章：<code>quote_verified=1</code> →「引句已核对」，只有节锚点 →「仅节锚点」，否则「未定位」；旧条目没有引句时显式标「无引句（旧条目）」，不隐藏。核对抽屉并排显示节正文与引句块，并提供「复制引用」（判断 + 题录 + 节 + 引句）。</p>
        <p>领域 IA 规划有 23 条路由，覆盖条目、笔记、论文、扫描、设置等；当前并非全部可用。新增路由前需要先确认它落在哪份共享状态上，避免出现「页面有自己的缓存」。</p>
      `
    },
    {
      id: "jumps",
      num: "05",
      title: "跳转规则",
      html: `
        <p>跳转只读状态，不复制状态：</p>
        <ul>
          <li><b>收件箱 → 清单</b>：携带当前周与领域筛选，不重置。</li>
          <li><b>清单 → 条目</b>：点击判断直接定位到条目；返回时保留清单滚动位置。</li>
          <li><b>条目 → 原文</b>：携带节锚点；阅读页未上线前，仅显示出处文本。</li>
          <li><b>候选 → 派活</b>：只传候选清单，不预设阅读顺序；顺序由 agent 决定。</li>
        </ul>
        <div class="callout">
          <span class="k">不做的事</span>
          <p>不在 URL 里放敏感令牌；不通过前端拼装后端没有的统计；不用「小圆点」代替明确的通道状态。所有可见状态都必须有数据落点。</p>
        </div>
      `
    },
    {
      id: "contract",
      num: "06",
      title: "后端数据契约",
      html: `
        <p>页面能承诺什么，取决于后端给了什么。几条核心契约：</p>
        <div class="dtable">
          <table>
            <thead><tr><th>界面元素</th><th>数据来源</th><th>缺数据时</th></tr></thead>
            <tbody>
              <tr><td><b>状态线</b></td><td>组会日期、待确认决定数、待验任务数</td><td>显示「未知」，不猜 0</td></tr>
              <tr><td><b>三列看板</b></td><td><code>tasks</code> 状态 + 工具轨迹</td><td>空列显示「暂无」，不伪造卡片</td></tr>
              <tr><td><b>本周清单</b></td><td>判断、粗筛、候选、<code>channel_runs</code></td><td>缺通道回执时显式标「未运行」</td></tr>
              <tr><td><b>领域条目</b></td><td><code>items</code> + 出处 + 轨迹</td><td>无出处显示「未定位」</td></tr>
            </tbody>
          </table>
        </div>
        <p>「缺数据时显示未知」比「显示 0」更重要。0 是一个事实，未知是另一个事实；把未知渲染成 0，会让漏检重新变得不可见。</p>
      `
    },
    {
      id: "future",
      num: "07",
      title: "阅读页的预留",
      html: `
        <p>阅读页是当前最大的功能缺口。规划中的路由是 <code>/p/[projectId]/paper/[paperId]</code>，要同时满足三件事：</p>
        <ul>
          <li><b>原文</b>：文档端点、节边界、页眉过滤，引句可高亮。</li>
          <li><b>分级</b>：L1 速览 / L2 精读 / L3 复现，<code>reading_level</code> 可写。</li>
          <li><b>动作</b>：高亮、批注、阅读进度；「精读才入库」的门槛。</li>
        </ul>
        <p>阅读页不是把 PDF 塞进 iframe。它要能把判断的节锚点映射到原文位置，否则「点开就是原文」仍然只是一句文案。完整缺口见<a href="./roadmap.html">已知限制与规划</a>。</p>
      `
    }
  ]
};

export default [architectureDiagram, reliability, usageFlow, frontendIa].map((doc, i) => ({
  ...doc,
  order: i + 4
}));
