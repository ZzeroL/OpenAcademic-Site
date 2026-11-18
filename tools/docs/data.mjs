const dataModel = {
  slug: "workspace-data-model",
  order: 8,
  section: "数据与通道",
  sectionEn: "DATA & CHANNELS",
  eyebrow: "DATA MODEL · 08",
  titleLead: "判断怎么落库，",
  titleGrad: "状态怎么被看见。",
  plainTitle: "工作区数据模型",
  lead:
    "工作区里最重要的不是论文表，而是判断表与轨迹轴。论文可以重新下载，判断与它的变更理由不能。本页给出逻辑模型、归属字段、只读视图与迁移影响面。",
  desc: "OpenAcademic 工作区数据模型：判断、决定、任务、轨迹轴的表结构与只读视图，以及归属字段、逻辑删除与迁移影响面。",
  card: "判断、决定、任务、轨迹与只读视图。",
  updated: "2026-11-13",
  read: "9 分钟",
  status: "已发布",
  facts: [
    { b: "9", s: "核心逻辑表" },
    { b: "3", s: "只读视图" },
    { b: "append", s: "轨迹轴写入方式" }
  ],
  related: ["architecture", "scan-candidates", "frontend-ia"],
  sections: [
    {
      id: "principles",
      num: "01",
      title: "建模原则：判断是主表",
      html: `
        <p>很多学术工具把论文当主表，判断是笔记的附属。OpenAcademic 反过来：<strong>判断是主表，论文是依据</strong>。一条判断可以引用多篇论文的多个节，但一条判断只有一个当前状态。</p>
        <div class="flow">
          <div class="flow-step"><b>DOMAIN</b><strong>领域</strong><span>归属维度，不是文件夹。</span></div>
          <i>→</i>
          <div class="flow-step"><b>ITEM</b><strong>判断</strong><span>主表；带状态与出处。</span></div>
          <i>→</i>
          <div class="flow-step"><b>EVIDENCE</b><strong>依据</strong><span>论文 + 节锚点 + 引句。</span></div>
          <i>→</i>
          <div class="flow-step"><b>TRAJECTORY</b><strong>轨迹</strong><span>append-only 变更日志。</span></div>
        </div>
        <p>这条原则决定了几件事：删除论文不能级联删除判断；判断的状态变更必须写轨迹；论文元数据可以刷新，判断的出处快照要保留。</p>
      `
    },
    {
      id: "tables",
      num: "02",
      title: "核心表",
      html: `
        <p>以下是逻辑表名与职责，物理表名、字段类型与索引以仓库迁移为准。</p>
        <div class="dtable">
          <table>
            <thead><tr><th>表</th><th>职责</th><th>关键字段（逻辑）</th><th>写入方</th></tr></thead>
            <tbody>
              <tr><td><b>domains</b></td><td>领域与归属</td><td>id、name、owner_id、status</td><td>管理员 / 工作区</td></tr>
              <tr><td><b>papers</b></td><td>论文元数据与文件</td><td>arxiv_id、doi、openalex_id、title、pdf_path、section_map</td><td>扫描 / 工具</td></tr>
              <tr><td><b>items</b></td><td>判断主表</td><td>id、domain_id、claim、status、paper_id、section、quote、locator_state</td><td>agent / 人</td></tr>
              <tr><td><b>decisions</b></td><td>本周决定</td><td>id、week、text、status、evidence_item_ids</td><td>agent 起草 / 人裁决</td></tr>
              <tr><td><b>tasks</b></td><td>派活与运行状态</td><td>id、domain_id、prompt、status、created_by、last_step</td><td>人 / runner</td></tr>
              <tr><td><b>trajectory_events</b></td><td>判断变更日志</td><td>id、item_id、action、reason、actor、created_at</td><td>只追加</td></tr>
              <tr><td><b>channel_runs</b></td><td>通道运行回执</td><td>id、channel、domain_id、week、status、hits、error</td><td>扫描</td></tr>
              <tr><td><b>scan_candidates</b></td><td>扫描候选池</td><td>domain_id、week、identifier、state、dispatched_task_id</td><td>扫描 / 派活</td></tr>
              <tr><td><b>notes</b></td><td>笔记与索引</td><td>id、domain_id、body、embedding_ref、links</td><td>人 / agent</td></tr>
            </tbody>
          </table>
        </div>
        <div class="callout">
          <span class="k">出处快照</span>
          <p><code>items</code> 上的 <code>section</code> 与 <code>quote</code> 是判断发表时的快照，不随论文版本静默更新。论文换版后，应显式标记「出处需复核」，而不是自动覆盖。</p>
        </div>
      `
    },
    {
      id: "item",
      num: "03",
      title: "一条判断的字段",
      html: `
        <div class="dtable">
          <table>
            <thead><tr><th>字段</th><th>含义</th><th>约束</th></tr></thead>
            <tbody>
              <tr><td><b>claim</b></td><td>判断本身，一句话</td><td>不写过程，不写「本文认为」</td></tr>
              <tr><td><b>status</b></td><td>候选 / 确认 / 推翻 / 搁置</td><td>只能经裁决或轨迹变更</td></tr>
              <tr><td><b>paper_id</b></td><td>主依据论文</td><td>可空；空时显示「未定位」</td></tr>
              <tr><td><b>section / quote</b></td><td>节锚点与引句</td><td>发表时快照；不做自动补全</td></tr>
              <tr><td><b>locator_state</b></td><td>已定位 / 未定位 / 需复核</td><td>未定位不可直接引用</td></tr>
              <tr><td><b>domain_id</b></td><td>归属领域</td><td>不可为空；跨领域用多条目</td></tr>
              <tr><td><b>owner_id</b></td><td>起草者</td><td>agent 或人，均可审计</td></tr>
            </tbody>
          </table>
        </div>
        <p>字段设计里没有「置信度」。置信度不能替代人裁决，反而会让候选态看起来像已定稿。不确定性通过 <code>locator_state</code> 与候选状态表达。</p>
      `
    },
    {
      id: "views",
      num: "04",
      title: "归属字段与只读视图",
      html: `
        <p>界面不直接拼装表，而是读视图。当前有三类只读视图：</p>
        <div class="split2">
          <div class="panel">
            <span class="k">v_week_digest</span>
            <h4>本周清单</h4>
            <p>判断、粗筛未读、候选与通道异常汇总；按领域 + 周聚合。</p>
          </div>
          <div class="panel">
            <span class="k">v_domain_items</span>
            <h4>领域条目流</h4>
            <p>判断 + 出处 + 当前状态；只包含未逻辑删除的条目。</p>
          </div>
          <div class="panel">
            <span class="k">v_channel_health</span>
            <h4>通道健康</h4>
            <p>每条通道最近一次运行状态、错误与下周是否重跑。</p>
          </div>
        </div>
        <p>归属字段统一用 <code>domain_id</code> 与 <code>owner_id</code>。多用户隔离靠 <code>owner_id</code> 与领域成员关系，而不是在前端过滤。视图里不要出现跨用户聚合，除非显式标注为管理员视图。</p>
      `
    },
    {
      id: "delete",
      num: "05",
      title: "逻辑删除与迁移",
      html: `
        <ul>
          <li><b>逻辑删除</b>：<code>deleted_at</code> 非空即视为删除；视图过滤，轨迹轴不删除。</li>
          <li><b>论文删除</b>：不级联删除判断；判断保留出处快照，标记「依据已移除」。</li>
          <li><b>状态回退</b>：不直接改 <code>status</code>；写一条轨迹事件，再由事件派生当前状态。</li>
          <li><b>迁移</b>：只增不删字段；旧字段保留读兼容，写路径先切新字段。</li>
        </ul>
        <div class="callout warn">
          <span class="k">迁移影响面</span>
          <p>改 <code>items</code> 或 <code>channel_runs</code> 的字段时，至少检查：工作区视图、清单聚合、扫描去重键、轨迹轴回放、pytest 里的工作区模型测试。任何一项没有覆盖，就不要合。</p>
        </div>
      `
    },
    {
      id: "impact",
      num: "06",
      title: "改动前的检查清单",
      html: `
        <ol>
          <li>新字段是否有明确的写入方与读取方？没有读取方的字段不加。</li>
          <li>新状态是否需要在界面可见？如果需要，它落在哪个视图？</li>
          <li>删除或合并是否破坏轨迹轴的可解释性？</li>
          <li>是否改变了候选去重键？跨周已派候选会不会重新入库？</li>
          <li>多用户隔离是否仍然成立？</li>
        </ol>
        <p>这五条来自实际缺口：候选跨周重复、状态无落点、轨迹无法回放，都会让「可核对」失效。</p>
      `
    },
    {
      id: "extend",
      num: "07",
      title: "怎么扩展",
      html: `
        <p>扩展数据模型时，优先加<strong>事件</strong>而不是加<strong>状态字段</strong>。事件可以回放，状态字段只能覆盖。只有当查询性能确实需要时，才从事件派生冗余字段，并保证它可以重建。</p>
        <blockquote>能重建的，才允许冗余；不能重建的，必须保留原事件。</blockquote>
        <p>相关阅读：<a href="./scan-candidates.html">候选落表与一键派活</a>解释候选键，<a href="./frontend-ia.html">收件箱、清单与领域</a>解释视图如何被页面消费。</p>
      `
    }
  ]
};

const scanCandidates = {
  slug: "scan-candidates",
  order: 9,
  section: "数据与通道",
  sectionEn: "DATA & CHANNELS",
  eyebrow: "SCAN · 09",
  titleLead: "候选落表，",
  titleGrad: "一键派活。",
  plainTitle: "候选落表与一键派活",
  lead:
    "三条通道每周跑一次，命中的论文先落候选池，再按「领域 + 周 + 标识」去重。派活只给清单，读哪几篇、按什么顺序，归 agent 自己定。",
  desc: "OpenAcademic 扫描候选：三通道、周窗口、领域 + 周 + 标识去重、scan_candidates 状态与一键派活边界。",
  card: "三通道落池、去重键与一键派活的边界。",
  updated: "2026-11-13",
  read: "8 分钟",
  status: "已发布",
  facts: [
    { b: "3", s: "扫描通道" },
    { b: "3 元", s: "去重键" },
    { b: "15", s: "示例候选量" }
  ],
  related: ["citation-tracking", "workspace-data-model", "reliability"],
  sections: [
    {
      id: "channels",
      num: "01",
      title: "三条通道各管什么",
      html: `
        <div class="dtable">
          <table>
            <thead><tr><th>通道</th><th>抓什么</th><th>数据源</th><th>典型失败</th></tr></thead>
            <tbody>
              <tr><td><b>关键词</b></td><td>组里已有叫法的新论文</td><td>arXiv，按领域关键词 + 本周 submittedDate 窗口</td><td>限流、查询超时</td></tr>
              <tr><td><b>引用链 · 前向</b></td><td>本周谁引了种子论文</td><td>OpenAlex</td><td>429、标识对不上</td></tr>
              <tr><td><b>引用链 · 后向</b></td><td>种子引了谁，哪些该读却没读</td><td>OpenAlex</td><td>429、引用列表不完整</td></tr>
            </tbody>
          </table>
        </div>
        <p>关键词抓「叫法」，引用链抓「邻近」。只有关键词会漏掉换了术语的同主题工作；只有引用链会漏掉尚未被引用的新预印本。两条路互为补集，不是冗余。</p>
      `
    },
    {
      id: "week",
      num: "02",
      title: "周窗口：先定周，再定范围",
      html: `
        <p>扫描以「领域 + 周」为单位运行。周窗口决定三件事：关键词通道的 submittedDate 范围、前向引用只看本周新增、后向引用只对本周种子跑。</p>
        <ul>
          <li><b>周起点</b>固定，避免不同人看到不同的「本周」。</li>
          <li><b>跨周不补扫</b>：上周没跑的通道记 <code>skip</code>，本周重新开始，不追溯填数。</li>
          <li><b>已派候选跨周不再入库</b>：派过的标识在后续周直接跳过，避免重复消耗阅读预算。</li>
        </ul>
        <div class="callout">
          <span class="k">为什么按周而不是实时</span>
          <p>研究阅读的节奏是周，不是秒。按周聚合让「本周清单」有稳定边界，也让通道失败可以在下周被显式重跑，而不是在实时流里被淹没。</p>
        </div>
      `
    },
    {
      id: "dedupe",
      num: "03",
      title: "候选键与去重",
      html: `
        <p>候选去重键是 <strong>领域 + 周 + 标识</strong>。标识优先用稳定 ID，而不是标题：</p>
        <div class="flow">
          <div class="flow-step"><b>KEY</b><strong>domain_id</strong><span>同一论文可属于多个领域。</span></div>
          <i>+</i>
          <div class="flow-step"><b>KEY</b><strong>week</strong><span>周窗口。</span></div>
          <i>+</i>
          <div class="flow-step"><b>KEY</b><strong>identifier</strong><span>arXiv id 优先，其次 DOI / OpenAlex id。</span></div>
        </div>
        <p>同一篇论文在同一周、同一领域只会有一条候选。不同通道同时命中时，合并来源而不是建两条；来源字段保留 <code>keyword</code> / <code>forward</code> / <code>backward</code> 以便解释「为什么它会出现」。</p>
        <div class="callout warn">
          <span class="k">标题不是键</span>
          <p>预印本改标题很常见。用标题做去重键会把同一篇论文识别成两篇，也会把不同论文合并。标题只用于展示与兜底对齐，不进入候选键。</p>
        </div>
      `
    },
    {
      id: "states",
      num: "04",
      title: "落表与状态",
      html: `
        <p><code>scan_candidates</code> 的逻辑状态很少，刻意保持简单：</p>
        <div class="dtable">
          <table>
            <thead><tr><th>状态</th><th>含义</th><th>下一步</th></tr></thead>
            <tbody>
              <tr><td><b>new</b></td><td>本周新落池，未派</td><td>等人一键派活，或留在池里</td></tr>
              <tr><td><b>dispatched</b></td><td>已生成任务</td><td>关联 <code>task_id</code>，等待阅读结果</td></tr>
              <tr><td><b>ignored</b></td><td>人决定不读</td><td>记录理由，跨周不再入库</td></tr>
            </tbody>
          </table>
        </div>
        <p>候选不是判断，不进入 <code>items</code>。只有精读后经 <code>save_item</code> 发表的判断才进入领域条目流。这条边界防止「扫到就算知道」。</p>
      `
    },
    {
      id: "dispatch",
      num: "05",
      title: "一键派活只给清单",
      html: `
        <p>「派给 agent」不预设阅读顺序，也不替 agent 选题。它只把候选清单交出去：</p>
        <div class="split2">
          <div class="panel">
            <span class="k">系统负责</span>
            <h4>给清单</h4>
            <p>候选 ID、标题、来源通道、领域、周；已派与未派数量。</p>
          </div>
          <div class="panel">
            <span class="k">agent 负责</span>
            <h4>定顺序</h4>
            <p>先读哪篇、要不要合读、粗筛还是精读；按任务目标自行决定。</p>
          </div>
        </div>
        <p>这与「人只做四个动作」一致：人决定要不要读这一批，agent 决定怎么读。如果系统硬编码阅读顺序，agent 就无法根据已有判断调整优先级。</p>
        <div class="claim">
          <div class="claim-top"><span class="k">候选卡 · 示意</span><span class="state">15 篇 · 已派 6</span></div>
          <p class="claim-t">扫描候选共 15 篇，未派 9 篇；按领域 + 周 + 标识去重，派过的跨周不再入库。</p>
          <div class="claim-src"><span class="claim-id">keyword 12</span><span class="claim-sec">forward 3</span><span class="claim-sec">backward skip</span></div>
          <div class="claim-foot"><span>一键派活 <b>只给清单</b></span><span>顺序归 agent</span></div>
        </div>
      `
    },
    {
      id: "failure",
      num: "06",
      title: "通道失败怎么落",
      html: `
        <p>每条通道每次运行都写一条 <code>channel_runs</code>，状态三选一：</p>
        <div class="pillars">
          <div class="pillar"><b>OK</b><h4>正常完成</h4><p>记录命中数；0 命中也是成功，不代表没有新论文。</p></div>
          <div class="pillar"><b>SKIP</b><h4>主动跳过</h4><p>429、限流或明确不跑；清单显示「下次再跑」。</p></div>
          <div class="pillar"><b>FAIL</b><h4>失败</h4><p>超时、解析错误、数据源不可用；附错误摘要。</p></div>
        </div>
        <p>网络失败不回 5xx，不影响清单生成。清单照常交付，只是把「哪条通道没跑」写出来。这条设计与「漏检可归因」直接相关：安静地少几条，比明确地失败更危险。</p>
      `
    },
    {
      id: "ops",
      num: "07",
      title: "口径与运维",
      html: `
        <ul>
          <li><b>命中数</b>是通道返回并落池的数量，不是去重后数量；去重后数量单独展示。</li>
          <li><b>已派</b>以 <code>dispatched</code> 状态为准；任务失败不自动回到 <code>new</code>，需要人工决定。</li>
          <li><b>跨周</b>不回溯补扫；历史周的数字不因本周重跑而改变。</li>
          <li><b>候选池清理</b>不做定时删除；<code>ignored</code> 保留理由，供后续解释「为什么没读」。</li>
        </ul>
        <p>引用链的对齐细节见<a href="./citation-tracking.html">前向 / 后向引用追踪</a>；实测口径见<a href="./identifier-alignment.html">三标识对齐报告</a>。</p>
      `
    }
  ]
};

const citationTracking = {
  slug: "citation-tracking",
  order: 10,
  section: "数据与通道",
  sectionEn: "DATA & CHANNELS",
  eyebrow: "CITATION · 10",
  titleLead: "前向 / 后向引用，",
  titleGrad: "对齐规则与回执。",
  plainTitle: "前向 / 后向引用追踪",
  lead:
    "arXiv 预印本在 Crossref 没有 DOI 记录，所以引用链走 OpenAlex：arXiv id → work 的 DOI 直达，没中再按标题兜底。通道 ok / fail / skip 都写回执。",
  desc: "OpenAcademic 引用追踪：arXiv id 到 OpenAlex work 的 DOI 直达与标题兜底，前向 / 后向扫描与通道回执。",
  card: "arXiv → OpenAlex 对齐、前向 / 后向与回执。",
  updated: "2026-11-13",
  read: "8 分钟",
  status: "已发布",
  facts: [
    { b: "100/100", s: "代理样本对齐" },
    { b: "99 + 1", s: "DOI 直达 + 标题兜底" },
    { b: "2", s: "引用方向" }
  ],
  related: ["scan-candidates", "identifier-alignment", "reliability"],
  sections: [
    {
      id: "why",
      num: "01",
      title: "为什么走 OpenAlex",
      html: `
        <p>arXiv 预印本通常没有正式 DOI；即使有 <code>10.48550</code>，Crossref 也查不到对应记录。直接用 DOI 查引用链会大面积落空。</p>
        <p>OpenAlex 以 work 为单位组织引用关系，能通过 arXiv id、DOI、标题等多个入口对齐。因此全文只从 arXiv 来，引用链与标识对齐走 OpenAlex，两套标识各司其职。</p>
        <div class="callout">
          <span class="k">边界</span>
          <p>OpenAlex 的引用列表可能滞后或不完整。后向引用只说明「它引了谁」，不保证穷尽；前向引用只说明「本周谁引了它」，不保证覆盖所有出版渠道。</p>
        </div>
      `
    },
    {
      id: "align",
      num: "02",
      title: "arXiv id → work：两条对齐路径",
      html: `
        <div class="flow vert">
          <div class="flow-step"><b>01</b><strong>DOI 直达</strong><span>用 arXiv id 找到对应 DOI，再查 OpenAlex work。</span></div>
          <i>↓ 未命中</i>
          <div class="flow-step"><b>02</b><strong>标题兜底</strong><span>规范化标题 + 年份 + 作者约束，匹配唯一 work。</span></div>
          <i>↓ 仍未命中</i>
          <div class="flow-step"><b>03</b><strong>显式未对齐</strong><span>标记并上清单，不猜、不静默丢弃。</span></div>
        </div>
        <p>标题兜底只在唯一匹配时采用。多个候选、标题差异过大或年份冲突，都按未对齐处理。对齐结果写入论文元数据，后续通道复用，避免每次重查。</p>
        <div class="dtable">
          <table>
            <thead><tr><th>结果</th><th>条件</th><th>后续行为</th></tr></thead>
            <tbody>
              <tr><td><b>DOI 直达</b></td><td>arXiv id 能映射到 DOI，OpenAlex 命中</td><td>写入 <code>openalex_id</code> 与 <code>doi</code></td></tr>
              <tr><td><b>标题兜底</b></td><td>规范化标题唯一匹配，年份一致</td><td>写入 <code>openalex_id</code>，标记 <code>matched_by=title</code></td></tr>
              <tr><td><b>未对齐</b></td><td>多候选 / 无候选 / 冲突</td><td>标记 <code>locator_state=unmatched</code>，上清单</td></tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      id: "forward",
      num: "03",
      title: "前向：本周谁引了种子",
      html: `
        <p>前向引用回答「种子论文的新邻居」。每周对领域内的种子论文跑一次，只保留本周新增的引用关系。</p>
        <ul>
          <li>输入：种子论文的 OpenAlex work id。</li>
          <li>过滤：引用时间落在本周窗口；去重键用被引 work + 引用 work。</li>
          <li>输出：候选论文（引用者），来源标 <code>forward</code>。</li>
          <li>失败：429 / 超时记 <code>skip</code> 或 <code>fail</code>，清单可见。</li>
        </ul>
        <p>前向引用的价值在于发现「刚开始引用种子的新工作」，而不是完整引用图谱。因此它不需要历史全量，只需要本周增量。</p>
      `
    },
    {
      id: "backward",
      num: "04",
      title: "后向：种子引了谁",
      html: `
        <p>后向引用回答「该读却没在读的邻近工作」。它对种子的参考文献列表跑一遍，把尚未入库的 work 变成候选。</p>
        <ul>
          <li>输入：种子的 OpenAlex referenced_works。</li>
          <li>过滤：排除库内已有论文、排除同周已派候选。</li>
          <li>输出：候选论文（被引者），来源标 <code>backward</code>。</li>
          <li>限制：OpenAlex 的引用列表可能缺项；缺失不补，按「未覆盖」处理。</li>
        </ul>
        <div class="callout warn">
          <span class="k">示例状态</span>
          <p>后向通道若遇 429，显示 <code>skip</code> 与「429 · 下次再跑」，而不是 0 命中。0 命中意味着跑过了但没有新候选；429 意味着没跑成。两者不能混。</p>
        </div>
      `
    },
    {
      id: "receipts",
      num: "05",
      title: "回执：ok / fail / skip",
      html: `
        <p>每条通道每次运行都写一条回执，至少包含：通道名、领域、周、状态、命中数、错误摘要、起止时间。</p>
        <div class="dtable">
          <table>
            <thead><tr><th>状态</th><th>触发</th><th>清单展示</th></tr></thead>
            <tbody>
              <tr><td><b>ok</b></td><td>正常返回，含 0 命中</td><td>命中数 + 窗口</td></tr>
              <tr><td><b>skip</b></td><td>429、限流、主动跳过</td><td>「下次再跑」+ 原因</td></tr>
              <tr><td><b>fail</b></td><td>超时、解析失败、数据源不可用</td><td>错误摘要 + 是否重跑</td></tr>
            </tbody>
          </table>
        </div>
        <p>回执不是日志，是产品数据。它决定清单里「通道异常」这一栏是否出现，也决定人下周要不要换源或补扫。</p>
      `
    },
    {
      id: "rules",
      num: "06",
      title: "对齐规则：对不上会标出来",
      html: `
        <ol>
          <li><b>优先稳定标识。</b>DOI 直达优先于标题；标题只做兜底。</li>
          <li><b>唯一匹配才采用。</b>多候选不取最高分，直接判未对齐。</li>
          <li><b>保留证据。</b>记录用了哪条路径、匹配到的 work id 与标题差异。</li>
          <li><b>不静默丢弃。</b>未对齐的种子仍参与关键词通道，只是引用链跳过并标记。</li>
          <li><b>可复核。</b>对齐结果可以人工改，改动写回执，不覆盖原记录。</li>
        </ol>
        <p>这套规则的目标不是把对齐率做高，而是让「对不上」可见。100/100 是当前代理样本的结果，不是永久保证。</p>
      `
    },
    {
      id: "limits",
      num: "07",
      title: "已知限制",
      html: `
        <ul>
          <li>OpenAlex 引用列表可能滞后，新预印本的被引关系不一定当周可见。</li>
          <li>标题兜底对同名论文、翻译标题、副标题变动敏感；宁可未对齐，不硬匹配。</li>
          <li>引用链只覆盖 OpenAlex 收录的 work，不覆盖未收录的会议论文或技术报告。</li>
          <li>后向引用不递归展开，避免候选爆炸；需要更深图谱时另开任务。</li>
        </ul>
        <p>实测方法与结果见<a href="./identifier-alignment.html">三标识对齐报告</a>；候选如何落池见<a href="./scan-candidates.html">候选落表与一键派活</a>。</p>
      `
    }
  ]
};

const identifierAlignment = {
  slug: "identifier-alignment",
  order: 94,
  section: "数据与通道",
  sectionEn: "DATA & CHANNELS",
  eyebrow: "BENCHMARK · 11",
  titleLead: "三标识对齐：",
  titleGrad: "100 篇代理样本实测。",
  plainTitle: "三标识对齐报告",
  lead:
    "2026-11-13 的代理样本 100 篇：OpenAlex 100/100 对齐，其中 99 篇 DOI 直达、1 篇标题兜底。样本来自 arXiv 主题检索，不是库内论文；本页说明口径、方法与限制。",
  desc: "OpenAcademic 三标识对齐报告：2026-11-13 代理样本 100 篇，OpenAlex 100/100（99 DOI 直达 + 1 标题兜底），含方法与限制。",
  card: "100 篇代理样本、100/100 对齐与口径。",
  updated: "2026-11-13",
  read: "6 分钟",
  status: "实测报告",
  facts: [
    { b: "100/100", s: "OpenAlex 对齐" },
    { b: "99", s: "DOI 直达" },
    { b: "1", s: "标题兜底" }
  ],
  related: ["citation-tracking", "scan-candidates", "roadmap"],
  sections: [
    {
      id: "summary",
      num: "01",
      title: "摘要",
      html: `
        <p class="lead-in">本报告验证一件事：给一批真实的 arXiv 论文标识，系统能否稳定找到对应的 OpenAlex work，从而支撑前向 / 后向引用链。</p>
        <div class="strip">
          <div><b>100</b><span>样本</span><em>arXiv 主题检索</em></div>
          <div><b>100</b><span>对齐</span><em>OpenAlex work</em></div>
          <div><b>99</b><span>DOI 直达</span><em>首选路径</em></div>
          <div><b>1</b><span>标题兜底</span><em>唯一匹配</em></div>
        </div>
        <p>结论：在当前代理样本上，三标识对齐没有失败案例；但样本不是库内论文，不能直接外推为线上全量对齐率。</p>
        `
    },
    {
      id: "sample",
      num: "02",
      title: "样本与方法",
      html: `
        <ul>
          <li><b>样本来源</b>：arXiv 主题检索结果，覆盖长上下文大语言模型相关主题。</li>
          <li><b>样本规模</b>：100 篇；不是随机全库抽样。</li>
          <li><b>时间</b>：2026-11-13 执行；结果只代表当日 OpenAlex 状态。</li>
          <li><b>对齐步骤</b>：arXiv id → DOI → OpenAlex work；未命中则规范化标题 + 年份 + 作者做唯一匹配。</li>
          <li><b>判定</b>：只有唯一匹配才算成功；多候选、冲突、无候选都算未对齐。</li>
        </ul>
        <div class="callout">
          <span class="k">为什么用代理样本</span>
          <p>库内论文还很少，直接用库内样本会低估预印本比例。用主题检索构造的代理样本更接近「刚发表、尚未正式出版」的真实输入。</p>
        </div>
      `
    },
    {
      id: "result",
      num: "03",
      title: "结果",
      html: `
        <div class="dtable">
          <table>
            <thead><tr><th>路径</th><th>数量</th><th>占比</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td><b>DOI 直达</b></td><td>99</td><td>99%</td><td>arXiv id 可映射到 DOI，OpenAlex 命中</td></tr>
              <tr><td><b>标题兜底</b></td><td>1</td><td>1%</td><td>规范化标题唯一匹配，年份一致</td></tr>
              <tr><td><b>未对齐</b></td><td>0</td><td>0%</td><td>无多候选、无冲突</td></tr>
              <tr><td><b>合计</b></td><td><b>100</b></td><td>100%</td><td>OpenAlex 100/100</td></tr>
            </tbody>
          </table>
        </div>
        <p>99 篇 DOI 直达说明：在当前样本里，arXiv → DOI 的映射覆盖率很高。1 篇标题兜底说明兜底路径确实会被用到，但需要严格约束，否则容易误配。</p>
      `
    },
    {
      id: "fallback",
      num: "04",
      title: "兜底路径分析",
      html: `
        <p>标题兜底不是「相似度最高就选」。本报告采用的约束：</p>
        <ol>
          <li>标题规范化：去空白、统一大小写、去除 LaTeX 命令与标点差异。</li>
          <li>年份必须一致；预印本年份与出版年份冲突时不采用。</li>
          <li>作者集合需有交集；完全无交集不采用。</li>
          <li>候选唯一才采用；两个以上候选直接判未对齐。</li>
        </ol>
        <p>这组约束牺牲了一部分召回，换取误配率。对引用链来说，错配比未对齐更糟：错配会把引用关系挂到另一篇论文上，而且很难被发现。</p>
      `
    },
    {
      id: "crossref",
      num: "05",
      title: "为什么不是 Crossref",
      html: `
        <p>arXiv 预印本在 Crossref 没有 <code>10.48550</code> 记录，直接按 DOI 查引用链会大面积落空。Crossref 的引用关系也更偏正式出版渠道。</p>
        <p>OpenAlex 同时覆盖预印本与正式出版，并提供 work 级引用列表，因此成为引用链的主数据源。这不代表 Crossref 无用；正式出版物的 DOI 校验仍可后续接入。</p>
        <div class="callout warn">
          <span class="k">口径提醒</span>
          <p>「OpenAlex 100/100」只指标识对齐，不指引用列表完整。对齐成功不代表前向 / 后向引用一定完整，二者需要分开评估。</p>
        </div>
      `
    },
    {
      id: "limits",
      num: "06",
      title: "限制",
      html: `
        <ul>
          <li><b>样本非随机</b>：主题检索样本偏向热门主题，可能高估对齐率。</li>
          <li><b>时间快照</b>：OpenAlex 数据每日变化；2026-11-13 的结果不能保证复现。</li>
          <li><b>单一数据源</b>：只测 OpenAlex，未对比 Semantic Scholar / PubMed。</li>
          <li><b>未覆盖库内论文</b>：库内论文的标识质量、版本更替未纳入。</li>
        </ul>
        <p>后续应补：库内论文全量对齐、多源交叉验证、错配人工抽检。这些属于<a href="./roadmap.html">验证债</a>的一部分。</p>
      `
    },
    {
      id: "reproduce",
      num: "07",
      title: "如何复现",
      html: `
        <ol>
          <li>用相同主题与检索窗口拉取 arXiv 样本，记录检索式与时间。</li>
          <li>对每篇记录 arXiv id、标题、年份、作者集合。</li>
          <li>先跑 DOI 直达；未命中再跑标题兜底，严格按唯一匹配判定。</li>
          <li>输出三列：DOI 直达、标题兜底、未对齐；未对齐附原因。</li>
          <li>与本次报告对比时，同时对比样本构成，而不只是对齐率。</li>
        </ol>
        <p>实现细节见<a href="./citation-tracking.html">前向 / 后向引用追踪</a>；候选落池见<a href="./scan-candidates.html">候选落表与一键派活</a>。</p>
      `
    }
  ]
};

export default [dataModel, scanCandidates, citationTracking, identifierAlignment].map((doc, i) => ({
  ...doc,
  order: i + 8
}));
