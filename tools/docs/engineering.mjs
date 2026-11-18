const deployment = {
  slug: "deployment",
  order: 12,
  section: "工程",
  sectionEn: "ENGINEERING",
  eyebrow: "DEPLOYMENT · 12",
  titleLead: "从本地启动，",
  titleGrad: "到服务器上线。",
  plainTitle: "服务器部署与升级",
  lead:
    "本地用 node start.mjs 拉起前后端；服务器走 systemd + Nginx，前端产物由 CI 出包，服务器上不编译。全新部署与旧版升级是两条路径，停机与回滚步骤不能混。",
  desc: "OpenAcademic 服务器部署与升级：systemd unit、Nginx 反代、前端产物发布与回滚、全新部署与旧版升级。",
  card: "systemd、Nginx、前端产物发布与回滚。",
  updated: "2026-11-13",
  read: "10 分钟",
  status: "已发布",
  facts: [
    { b: "2", s: "systemd 服务" },
    { b: "0", s: "服务器上编译" },
    { b: "1", s: "数据根目录" }
  ],
  related: ["development-workflow", "architecture-diagram", "roadmap"],
  sections: [
    {
      id: "shape",
      num: "01",
      title: "部署形态与前置",
      html: `
        <p>生产形态是<strong>单机、多用户、自部署</strong>：Nginx 在最前，两个 systemd 服务（前端与后端），数据放在代码目录之外。没有外部数据库、消息队列或对象存储。</p>
        <div class="dtable">
          <table>
            <thead><tr><th>组件</th><th>要求</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td><b>Python</b></td><td>≥ 3.10</td><td>后端与 Agent 内核</td></tr>
              <tr><td><b>Node.js</b></td><td>≥ 20.9</td><td>前端构建与 <code>start.mjs</code></td></tr>
              <tr><td><b>模型端点</b></td><td>OpenAI 兼容</td><td><code>MODEL_NAME</code> / <code>MODEL_URL</code> / <code>MODEL_API_KEY</code></td></tr>
              <tr><td><b>网络</b></td><td>可访问 arXiv / OpenAlex</td><td>引用链与外链下载</td></tr>
              <tr><td><b>存储</b></td><td>本地磁盘</td><td>SQLite、Chroma、论文文件</td></tr>
            </tbody>
          </table>
        </div>
        <p>Windows 下激活虚拟环境用 <code>.venv\\Scripts\\activate</code>，其余命令相同。GitHub 镜像：<code>https://github.com/ZzeroL/OpenAcademic.git</code>；主仓在 Gitee。</p>
      `
    },
    {
      id: "local",
      num: "02",
      title: "本地启动",
      html: `
        <div class="codeblock">
          <div class="bar"><span class="lamp"><i class="r"></i><i class="y"></i><i class="g"></i></span><span>quickstart · bash</span></div>
          <pre><span class="p">$</span> git clone https://github.com/ZzeroL/OpenAcademic.git
<span class="p">$</span> cd OpenAcademic &amp;&amp; python -m venv .venv
<span class="p">$</span> source .venv/bin/activate &amp;&amp; pip install -e .
<span class="p">$</span> cd frontend &amp;&amp; npm ci &amp;&amp; cd ..
<span class="p">$</span> cp .env.example .env   <span class="w"># 填 MODEL_NAME / URL / API_KEY</span>
<span class="p">$</span> node start.mjs
<span class="ok">✓ ready → http://localhost:3000</span></pre>
        </div>
        <p>首次启动才会初始化：建工作区 → 播种技能 → 建库 → 插入管理员。clone 本身不建库、不建工作区、不写任何配置。</p>
        <div class="callout warn">
          <span class="k">第一件事：改密</span>
          <p>初始管理员 <code>admin@example.com / admin123</code> 公开写在源码里，等同无口令。登录后立即改密，再给组员开账号。没有注册入口，账号由管理员创建。</p>
        </div>
      `
    },
    {
      id: "env",
      num: "03",
      title: "生产目录与环境变量",
      html: `
        <p>生产环境把数据根移出代码目录：</p>
        <div class="dtable">
          <table>
            <thead><tr><th>变量</th><th>用途</th><th>注意</th></tr></thead>
            <tbody>
              <tr><td><b><code>OPENACADEMIC_HOME</code></b></td><td>数据根目录</td><td>SQLite、Chroma、论文文件、密钥</td></tr>
              <tr><td><b><code>MODEL_NAME</code></b></td><td>模型名</td><td>与端点一致</td></tr>
              <tr><td><b><code>MODEL_URL</code></b></td><td>OpenAI 兼容端点</td><td>不要带多余路径</td></tr>
              <tr><td><b><code>MODEL_API_KEY</code></b></td><td>密钥</td><td>由 <code>.secret_key</code> 加密存储</td></tr>
            </tbody>
          </table>
        </div>
        <p><code>.secret_key</code> 是解密已存 API Key 的唯一钥匙。备份它，不要重新生成；重生成等于让所有已存密钥失效。</p>
        <div class="callout">
          <span class="k">目录结构</span>
          <p>建议 <code>/srv/openacademic/data</code> 放数据，<code>/srv/openacademic/app</code> 放代码，<code>/srv/openacademic/releases</code> 放前端产物。升级时只换 app 与 releases，不动 data。</p>
        </div>
      `
    },
    {
      id: "systemd",
      num: "04",
      title: "systemd 与 Nginx",
      html: `
        <p>两个 unit：一个跑后端，一个跑前端产物。按模板安装后开启自启。</p>
        <div class="codeblock">
          <div class="bar"><span class="lamp"><i class="r"></i><i class="y"></i><i class="g"></i></span><span>server · systemctl</span></div>
          <pre><span class="p">$</span> sudo systemctl enable --now openacademic-backend
<span class="p">$</span> sudo systemctl enable --now openacademic-frontend
<span class="p">$</span> sudo systemctl status openacademic-backend --no-pager</pre>
        </div>
        <p>Nginx 负责 TLS、反代与静态产物。后端只监听本机端口，不直接对公网暴露。上传大小、超时与 SSE 的缓冲需要按实际调整，尤其是长任务事件流。</p>
        <div class="callout warn">
          <span class="k">SSE 注意</span>
          <p>反向代理默认可能缓冲事件流，导致界面进度延迟。需要关闭对应路径的代理缓冲，并给足读超时；否则任务在跑，页面看起来像卡住。</p>
        </div>
      `
    },
    {
      id: "release",
      num: "05",
      title: "前端产物：发布与回滚",
      html: `
        <p>前端由 CI 出包，服务器下载后切换 release，不在服务器上编译。</p>
        <div class="codeblock">
          <div class="bar"><span class="lamp"><i class="r"></i><i class="y"></i><i class="g"></i></span><span>deploy.sh · server</span></div>
          <pre><span class="p">$</span> ./deploy.sh startall
<span class="p">$</span> ./deploy.sh release /tmp/frontend.tar.gz &lt;sha&gt;
<span class="p">$</span> ./deploy.sh health   <span class="ok">all ok</span>
<span class="p">$</span> ./deploy.sh status
<span class="p">$</span> ./deploy.sh rollback</pre>
        </div>
        <ul>
          <li><b>发布</b>：解包到新的 release 目录，切换符号链接，重载前端服务。</li>
          <li><b>健康检查</b>：后端健康接口 + 前端首页 + 关键 API。</li>
          <li><b>回滚</b>：切回上一个 release；数据与后端代码不回滚，除非同版本发布说明要求。</li>
        </ul>
        <p>发布顺序建议：后端兼容改动 → 前端产物 → 配置变更。先让旧前端能跑新后端，再切前端，回滚窗口最小。</p>
      `
    },
    {
      id: "upgrade",
      num: "06",
      title: "从旧版升级",
      html: `
        <p>旧版使用 <code>IPAPER_</code> 前缀。升级不是覆盖安装，而是新目录并行：</p>
        <ol>
          <li>代码放到新目录，不要覆盖旧目录。</li>
          <li><code>.env</code> 里的 <code>IPAPER_</code> 改成 <code>OPENACADEMIC_</code>。</li>
          <li><code>.secret_key</code> 原样复制，不重新生成。</li>
          <li>指向同一数据目录，先启动新版做健康检查。</li>
          <li>确认无误后切 Nginx upstream，再停旧服务。</li>
        </ol>
        <div class="callout warn">
          <span class="k">不要做的事</span>
          <p>不要删除旧目录作为「清理」；不要在未备份 <code>.secret_key</code> 的情况下重装；不要在数据目录里直接跑迁移而不先备份。</p>
        </div>
        <p>停机与回滚需要按发布说明逐条执行。若没有发布说明，按「新目录 + 同数据 + 健康检查 + 切流」的最小路径操作。</p>
      `
    },
    {
      id: "security",
      num: "07",
      title: "上线前安全清单",
      html: `
        <div class="dtable">
          <table>
            <thead><tr><th>项</th><th>当前</th><th>上线要求</th></tr></thead>
            <tbody>
              <tr><td><b>管理员口令</b></td><td>公开默认值</td><td class="wip">立即修改</td></tr>
              <tr><td><b>HTTPS</b></td><td>Nginx 可配</td><td class="wip">强制跳转</td></tr>
              <tr><td><b>Cookie Secure</b></td><td>未设置</td><td class="wip">开启</td></tr>
              <tr><td><b>会话令牌</b></td><td>明文存储</td><td class="wip">哈希存储</td></tr>
              <tr><td><b>配置密文</b></td><td>AES-CBC 无 MAC</td><td class="wip">AES-GCM / HMAC</td></tr>
              <tr><td><b>CORS</b></td><td>全开</td><td class="wip">收窄到域名</td></tr>
              <tr><td><b>登录节流</b></td><td>无</td><td class="wip">失败次数限制</td></tr>
              <tr><td><b>账号开通</b></td><td>管理员建号</td><td class="ok">保持</td></tr>
            </tbody>
          </table>
        </div>
        <p>内部小团队可以先跑；对公网开放前，这张表里的 <code>wip</code> 项必须处理。</p>
      `
    },
    {
      id: "troubleshoot",
      num: "08",
      title: "故障排查顺序",
      html: `
        <ol>
          <li><b>看服务</b>：<code>systemctl status</code> 两个 unit 是否都在跑。</li>
          <li><b>看健康</b>：<code>./deploy.sh health</code> 是否通过；后端能否读数据目录。</li>
          <li><b>看日志</b>：后端日志里找任务 ID、工具失败与通道状态，不只 grep 500。</li>
          <li><b>看 SSE</b>：界面卡住但任务在跑，优先查 Nginx 缓冲与超时。</li>
          <li><b>看磁盘</b>：论文文件与 Chroma 索引增长；空间不足会先表现为写入失败。</li>
          <li><b>看密钥</b>：模型调用失败且日志提示解密错误，检查 <code>.secret_key</code> 是否被替换。</li>
        </ol>
        <div class="callout ok">
          <span class="k">排查原则</span>
          <p>先确认「失败发生在哪一层」，再决定重启什么。盲目重启会丢掉正在运行的任务上下文，让问题更难复现。</p>
        </div>
      `
    }
  ]
};

const development = {
  slug: "development-workflow",
  order: 13,
  section: "工程",
  sectionEn: "ENGINEERING",
  eyebrow: "WORKFLOW · 13",
  titleLead: "分支、检查清单，",
  titleGrad: "与发版节奏。",
  plainTitle: "开发与发版流程",
  lead:
    "日常提交走 Gitee，GitHub 收口同步；两边内容一致。分支、提交规范、PR 检查清单、测试与前端构建都服务于同一件事：让改动可核对。",
  desc: "OpenAcademic 开发与发版流程：分支、提交规范、PR 检查清单、测试、前端构建与 Gitee / GitHub 双仓同步。",
  card: "分支、PR 清单、测试与双仓同步。",
  updated: "2026-11-13",
  read: "7 分钟",
  status: "已发布",
  facts: [
    { b: "2", s: "远端仓库" },
    { b: "3", s: "必过检查" },
    { b: "1", s: "发布口径" }
  ],
  related: ["roadmap", "deployment", "architecture"],
  sections: [
    {
      id: "repos",
      num: "01",
      title: "仓库与分支",
      html: `
        <p>主仓在 Gitee，GitHub 收口同步。两边内容一致，不维护分叉。日常开发在功能分支，<code>main</code> 保持可发布。</p>
        <div class="dtable">
          <table>
            <thead><tr><th>分支</th><th>用途</th><th>合并方式</th></tr></thead>
            <tbody>
              <tr><td><b>main</b></td><td>可发布版本</td><td>只接受 PR / MR</td></tr>
              <tr><td><b>feat/*</b></td><td>新能力</td><td>合并后删除</td></tr>
              <tr><td><b>fix/*</b></td><td>缺陷修复</td><td>合并后删除</td></tr>
              <tr><td><b>chore/*</b></td><td>构建、依赖、文档</td><td>合并后删除</td></tr>
            </tbody>
          </table>
        </div>
        <p>不直接在 <code>main</code> 上提交，不用 force push 覆盖他人分支。若发现冲突，先 rebase 自己的分支，而不是重置主分支。</p>
      `
    },
    {
      id: "commits",
      num: "02",
      title: "提交规范",
      html: `
        <p>提交信息写「为什么」，不写「改了什么」——改了什么，diff 里都有。</p>
        <div class="codeblock">
          <div class="bar"><span class="lamp"><i class="r"></i><i class="y"></i><i class="g"></i></span><span>commit style</span></div>
          <pre>feat(scan): 候选按领域 + 周 + 标识去重
fix(agent): 工具失败时保留原始状态
docs(deploy): 补旧版 IPAPER_ 升级路径
chore(ci): 增加前端 typecheck 门禁</pre>
        </div>
        <ul>
          <li><b>类型</b>：feat / fix / docs / chore / refactor / test。</li>
          <li><b>范围</b>：模块名，如 <code>scan</code>、<code>agent</code>、<code>deploy</code>。</li>
          <li><b>正文</b>：必要时写影响面、迁移、验证方式；不要贴大段日志。</li>
          <li><b>一个提交一件事</b>：格式化与功能改动分开，便于回滚。</li>
        </ul>
      `
    },
    {
      id: "pr",
      num: "03",
      title: "PR 检查清单",
      html: `
        <p>提交 PR 前逐项确认。检查清单不是形式，是防止「看起来能用」的改动进入 <code>main</code>。</p>
        <ul class="pillrow">
          <li>测试通过</li>
          <li>lint / typecheck 通过</li>
          <li>前端构建通过</li>
          <li>迁移影响面已评估</li>
          <li>失败状态可见</li>
          <li>文档已同步</li>
          <li>无敏感信息</li>
          <li>回滚路径清晰</li>
        </ul>
        <div class="callout">
          <span class="k">重点看什么</span>
          <p>涉及判断、出处、通道回执的改动，必须说明「失败时界面显示什么」。只写成功路径的 PR，默认还没完成。</p>
        </div>
        <p>不跳过 hooks，不用 <code>--no-verify</code> 绕过检查。如果 hook 失败，修根因，不修提示。</p>
      `
    },
    {
      id: "tests",
      num: "04",
      title: "测试",
      html: `
        <p>pytest 覆盖记忆层、领域容器、上下文回收、工作区模型、通道与 PDF 读取。前端目前以构建与人工验证为主。</p>
        <div class="split2">
          <div class="panel">
            <span class="k">优先补测</span>
            <h4>容易静默失败的地方</h4>
            <ul>
              <li><code>crypto_utils</code> 往返与 mask</li>
              <li><code>load_model_config</code> 合并优先级</li>
              <li><code>AgentState.update_todos</code> 终止路径</li>
              <li><code>run_agent_stream</code> 事件序列</li>
              <li>多会话并发与断连续跑</li>
            </ul>
          </div>
          <div class="panel">
            <span class="k">人工验证</span>
            <h4>只能真机跑</h4>
            <ul>
              <li>多用户隔离</li>
              <li>PDF 真样本页眉过滤</li>
              <li>领域 IA 23 条路由</li>
              <li>一次真机精读端到端</li>
            </ul>
          </div>
        </div>
        <p>测试债的完整清单见<a href="./roadmap.html">已知限制与规划</a>。</p>
      `
    },
    {
      id: "ci",
      num: "05",
      title: "前端构建与 CI",
      html: `
        <p>CI 跑在 GitHub Actions；主仓在 Gitee，因此需要镜像或自建 runner。前端产物由 CI 出包，服务器只跑产物。</p>
        <div class="flow">
          <div class="flow-step"><b>01</b><strong>检查</strong><span>lock 文件、lint、typecheck、测试。</span></div>
          <i>→</i>
          <div class="flow-step"><b>02</b><strong>构建</strong><span>前端产物打包，记录 commit sha。</span></div>
          <i>→</i>
          <div class="flow-step"><b>03</b><strong>发布</strong><span>上传产物，服务器按 sha 切换。</span></div>
          <i>→</i>
          <div class="flow-step"><b>04</b><strong>验证</strong><span>健康检查；失败可回滚。</span></div>
        </div>
        <p>依赖必须锁版本。不在服务器上 <code>npm install</code>，也不在 CI 里跑会改写 lock 文件的命令。</p>
      `
    },
    {
      id: "release",
      num: "06",
      title: "发版与双仓同步",
      html: `
        <ol>
          <li>功能分支合入 <code>main</code>，等待检查全绿。</li>
          <li>在 Gitee 打 tag；同步到 GitHub，保持两边 commit 一致。</li>
          <li>CI 出前端包；按<a href="./deployment.html">服务器部署与升级</a>发布。</li>
          <li>发布说明写：迁移、配置变更、回滚注意、验证结果。</li>
        </ol>
        <p>双仓同步优先用 <code>git push --mirror</code> 或等价方式，不手工复制文件。若出现分叉，先对齐再发布，不要在两个远端各改一版。</p>
      `
    },
    {
      id: "rework",
      num: "07",
      title: "常见返工与避免方式",
      html: `
        <div class="dtable">
          <table>
            <thead><tr><th>返工</th><th>根因</th><th>避免</th></tr></thead>
            <tbody>
              <tr><td><b>功能「完成」但没有状态落点</b></td><td>只做了界面</td><td>先写数据契约，再做视图</td></tr>
              <tr><td><b>失败路径没人测</b></td><td>只验证成功案例</td><td>PR 必须写失败时显示什么</td></tr>
              <tr><td><b>升级覆盖旧目录</b></td><td>图省事</td><td>新目录并行 + 健康检查 + 切流</td></tr>
              <tr><td><b>双仓分叉</b></td><td>手工复制</td><td>镜像同步，发布前对齐</td></tr>
            </tbody>
          </table>
        </div>
        <p>返工不可怕，怕的是返工之后没有更新检查清单。每次线上问题都应该变成一条可执行的检查项。</p>
      `
    }
  ]
};

const desktop = {
  slug: "desktop-packaging",
  order: 14,
  section: "工程",
  sectionEn: "ENGINEERING",
  eyebrow: "DESKTOP · 14",
  titleLead: "把服务器，",
  titleGrad: "收进一台电脑。",
  plainTitle: "桌面打包设计",
  lead:
    "桌面形态仍是设计稿，不是已发布能力。本页定义打包边界、数据目录与运行期约束，供后续实现与评审使用；外壳选型尚未定稿。",
  desc: "OpenAcademic 桌面打包设计：打包边界、数据目录、运行期约束、未决问题与验收标准。当前仍是设计稿。",
  card: "打包边界、数据目录与运行期约束（设计稿）。",
  updated: "2026-11-13",
  read: "6 分钟",
  status: "设计稿",
  facts: [
    { b: "0", s: "已发布桌面包" },
    { b: "1", s: "本地数据根" },
    { b: "3", s: "必须先定的约束" }
  ],
  related: ["deployment", "architecture", "roadmap"],
  sections: [
    {
      id: "status",
      num: "01",
      title: "这是一份设计稿",
      html: `
        <p class="lead-in">桌面形态尚未实现。本页不是安装说明，而是边界文档：哪些能力必须保留、哪些可以舍弃、数据放在哪里、失败时怎么办。</p>
        <div class="callout warn">
          <span class="k">现状</span>
          <p>当前只有 Web 与 CLI 两种形态。桌面包没有发布，也没有承诺时间表。任何「已经支持桌面版」的说法都不准确。</p>
        </div>
      `
    },
    {
      id: "shape",
      num: "02",
      title: "目标形态",
      html: `
        <p>目标不是把 Web 套一个壳，而是<strong>单用户、本地优先</strong>的研究工作站：</p>
        <ul>
          <li>复用同一套 <code>core</code>、工具与记忆，不另写一套 Agent。</li>
          <li>本地启动后端与前端，默认只监听回环地址。</li>
          <li>数据、论文与密钥都在本机，不依赖外部数据库。</li>
          <li>模型端点与 arXiv / OpenAlex 仍需网络；离线时只读已有数据。</li>
        </ul>
        <p>外壳选型（如 Tauri / Electron）尚未定稿。选型标准应优先看：安装体积、系统 WebView 依赖、进程管理与自动更新能力。</p>
      `
    },
    {
      id: "data",
      num: "03",
      title: "数据目录",
      html: `
        <p>桌面版必须把数据放在用户目录，而不是安装目录：</p>
        <div class="dtable">
          <table>
            <thead><tr><th>位置</th><th>内容</th><th>迁移</th></tr></thead>
            <tbody>
              <tr><td><b>UserData</b></td><td>SQLite、Chroma、论文文件、<code>.secret_key</code></td><td>可导出 / 导入</td></tr>
              <tr><td><b>Cache</b></td><td>可重取的 PDF、模型响应缓存</td><td>可清空</td></tr>
              <tr><td><b>Logs</b></td><td>运行日志、崩溃转储</td><td>可轮转</td></tr>
            </tbody>
          </table>
        </div>
        <p>桌面版与服务器共用 <code>OPENACADEMIC_HOME</code> 语义：切换目录就等于切换工作区。导入导出必须包含 <code>.secret_key</code> 的说明，否则用户换机后无法解密已存密钥。</p>
        <div class="callout">
          <span class="k">备份</span>
          <p>备份是一个目录复制动作，不是一个数据库导出命令。论文文件与向量索引都在目录里，只导出 SQLite 会丢依据。</p>
        </div>
      `
    },
    {
      id: "runtime",
      num: "04",
      title: "运行期约束",
      html: `
        <div class="split2">
          <div class="panel">
            <span class="k">PROCESS</span>
            <h4>单实例</h4>
            <p>同一数据目录只允许一个实例运行；重复启动应聚焦已有窗口，而不是开第二个后端。</p>
          </div>
          <div class="panel">
            <span class="k">NETWORK</span>
            <h4>只监听回环</h4>
            <p>默认 <code>127.0.0.1</code>，不开放局域网；需要远程访问时走显式配置，并提示风险。</p>
          </div>
          <div class="panel">
            <span class="k">LIFECYCLE</span>
            <h4>关窗不退任务</h4>
            <p>关闭窗口应提示运行中任务；退出时保存 queued 状态，下次启动恢复。</p>
          </div>
          <div class="panel">
            <span class="k">SECRETS</span>
            <h4>系统钥匙串优先</h4>
            <p>若可用，<code>.secret_key</code> 交由系统钥匙串保管；不可用时至少限制文件权限。</p>
          </div>
        </div>
        <p>这些约束的核心是：桌面版不是一个更小的服务器，而是一个<strong>数据归用户所有</strong>的本地工作区。</p>
      `
    },
    {
      id: "boundary",
      num: "05",
      title: "打包边界",
      html: `
        <p>以下能力在桌面版里保留或舍弃，需要先定：</p>
        <div class="dtable">
          <table>
            <thead><tr><th>能力</th><th>桌面版</th><th>理由</th></tr></thead>
            <tbody>
              <tr><td><b>Agent 内核 / 工具 / 记忆</b></td><td class="ok">保留</td><td>产品核心，不能分叉</td></tr>
              <tr><td><b>收件箱 / 清单 / 领域</b></td><td class="ok">保留</td><td>主界面</td></tr>
              <tr><td><b>多用户与管理员建号</b></td><td class="no">舍弃</td><td>单用户本地，保留单账号即可</td></tr>
              <tr><td><b>systemd / Nginx</b></td><td class="no">舍弃</td><td>改由外壳管理进程</td></tr>
              <tr><td><b>SSE 进度流</b></td><td class="ok">保留</td><td>本机回环，成本低</td></tr>
              <tr><td><b>自动更新</b></td><td class="wip">待定</td><td>需签名与回滚策略</td></tr>
            </tbody>
          </table>
        </div>
        <p>舍弃多用户不等于删除鉴权代码；桌面版可以用单账号模式启动，但数据模型仍保留 <code>owner_id</code>，避免未来迁移时重写。</p>
      `
    },
    {
      id: "open",
      num: "06",
      title: "未决问题",
      html: `
        <ul>
          <li><b>外壳与 WebView</b>：系统 WebView 版本差异会影响 SSE 与字体渲染。</li>
          <li><b>Python 运行时</b>：打包 Python 依赖还是要求用户自装；后者会显著提高上手成本。</li>
          <li><b>自动更新</b>：签名、增量包、失败回滚、数据目录兼容都没有定。</li>
          <li><b>本地模型</b>：是否支持本地推理端点；若支持，显存与进程管理需要额外设计。</li>
          <li><b>导入既有工作区</b>：从服务器迁移到桌面，<code>.secret_key</code> 与论文文件如何校验。</li>
        </ul>
        <p>这些问题没有答案之前，不应发布「桌面版预览」。预览会制造支持承诺，而当前没有对应的验证能力。</p>
      `
    },
    {
      id: "acceptance",
      num: "07",
      title: "验收标准",
      html: `
        <ol>
          <li>首次启动完成建工作区、建库、播种账号，且不需要命令行。</li>
          <li>断网时能打开已有清单与条目，明确提示模型不可用。</li>
          <li>关闭窗口后重开，queued 任务恢复，running 任务标为中断。</li>
          <li>导出目录在另一台机器导入后，已存密钥可解密，判断出处可打开。</li>
          <li>升级失败可回滚到上一版本，数据目录不被破坏。</li>
          <li>崩溃后日志可定位到任务与工具步骤，而不是只有一段堆栈。</li>
        </ol>
        <p>这些标准与服务器部署的<a href="./deployment.html">安全清单</a>共享同一条原则：失败要可见，数据要可迁移。</p>
      `
    }
  ]
};

const methodology = {
  slug: "research-methodology",
  order: 15,
  section: "工程",
  sectionEn: "ENGINEERING",
  eyebrow: "PROPOSAL · 15",
  titleLead: "为什么是「判断的",
  titleGrad: "变更日志」。",
  plainTitle: "研究方法提案",
  lead:
    "这是一份早期方法论稿，保留作背景：为什么会从「文献综述工具」走到「判断的变更日志」。它不描述当前全部实现，但解释了产品几条硬约束的来源。",
  desc: "OpenAcademic 研究方法提案：从文献综述到判断账本，可核对、可归因、可推翻三原则，以及它与当前产品的关系。",
  card: "早期方法论：为什么记录判断的变更。",
  updated: "2026-11-13",
  read: "7 分钟",
  status: "背景稿",
  facts: [
    { b: "3", s: "方法论原则" },
    { b: "5", s: "方法环节" },
    { b: "1", s: "核心转向" }
  ],
  related: ["product-thesis", "usage-flow", "roadmap"],
  sections: [
    {
      id: "why",
      num: "01",
      title: "为什么写这份稿",
      html: `
        <p>最初的设想是一个「更快的文献综述工具」：输入主题，输出摘要与引用列表。写到一半发现，真正的问题不在生成速度，而在<strong>半年后还能不能解释当时的判断</strong>。</p>
        <p>综述工具交付的是一份静态文本；研究过程需要的是判断如何形成、如何被推翻、依据换了之后如何更新。这份稿记录了那次转向。</p>
        <div class="callout">
          <span class="k">阅读提示</span>
          <p>本页是背景材料，不是当前产品规格。与现状冲突时，以<a href="./roadmap.html">路线图</a>和代码为准。</p>
        </div>
      `
    },
    {
      id: "shift",
      num: "02",
      title: "从文献综述到判断账本",
      html: `
        <div class="split2">
          <div class="panel">
            <span class="k">旧设想</span>
            <h4>一份好看的综述</h4>
            <p>按主题聚合论文，生成段落与引用；质量取决于模型那一次的输出。</p>
          </div>
          <div class="panel">
            <span class="k">新设想</span>
            <h4>一本判断的账本</h4>
            <p>每条判断带出处与状态；起草、确认、推翻都留痕，综述只是账本的一种视图。</p>
          </div>
        </div>
        <p>这个转向带来几个直接后果：数据模型以判断为主表；界面以收件箱而非对话框为主；agent 只能发表候选判断，不能定稿；漏检必须可归因，而不是用「召回率」一句带过。</p>
        <blockquote>交付物不是一段文字，是一组可以被追问「凭什么」的判断。</blockquote>
      `
    },
    {
      id: "principles",
      num: "03",
      title: "三个原则",
      html: `
        <div class="pillars">
          <div class="pillar"><b>01 · VERIFIABLE</b><h4>可核对</h4><p>每条判断能回到原文的节与引句；定位不到就标未定位。</p></div>
          <div class="pillar"><b>02 · ATTRIBUTABLE</b><h4>可归因</h4><p>没读到的论文、没跑成的通道，都要在清单里有位置。</p></div>
          <div class="pillar"><b>03 · REVERSIBLE</b><h4>可推翻</h4><p>判断可以改，但改要留理由；轨迹 append-only。</p></div>
        </div>
        <p>三原则互相约束：只可核对不可归因，会漏掉「没读到」；只可归因不可推翻，会把错误判断固化；只可推翻不可核对，会退化成聊天记录。</p>
      `
    },
    {
      id: "method",
      num: "04",
      title: "方法：五个环节",
      html: `
        <div class="flow vert">
          <div class="flow-step"><b>01 · DIRECTION</b><strong>定方向</strong><span>用一句话描述要弄明白什么，不预设检索式。</span></div>
          <i>↓</i>
          <div class="flow-step"><b>02 · CHANNELS</b><strong>扫通道</strong><span>关键词 + 引用链，记录跑了什么、哪里没跑。</span></div>
          <i>↓</i>
          <div class="flow-step"><b>03 · READING</b><strong>分级阅读</strong><span>粗筛 → 精读 → 复现；精读才入库。</span></div>
          <i>↓</i>
          <div class="flow-step"><b>04 · JUDGMENT</b><strong>写判断</strong><span>一条判断一个主张，带节锚点与引句。</span></div>
          <i>↓</i>
          <div class="flow-step"><b>05 · TRAJECTORY</b><strong>记变更</strong><span>确认、推翻、搁置都写理由，形成可回放的账本。</span></div>
        </div>
        <p>五个环节里，人主要参与 01 与 04 的裁决；02 与 03 尽量交给系统；05 是系统责任，不能靠人补记。</p>
      `
    },
    {
      id: "relation",
      num: "05",
      title: "与当前产品的关系",
      html: `
        <p>当前实现保留了三原则与五个环节的骨架，但在范围上收窄：</p>
        <div class="dtable">
          <table>
            <thead><tr><th>提案中的想法</th><th>当前状态</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td><b>判断账本</b></td><td class="ok">已落地</td><td><code>items</code> + 轨迹轴</td></tr>
              <tr><td><b>漏检归因</b></td><td class="ok">已落地</td><td>三通道 + <code>channel_runs</code></td></tr>
              <tr><td><b>分级阅读</b></td><td class="wip">部分</td><td>四态约定已有，阅读页未完成</td></tr>
              <tr><td><b>可追溯综述</b></td><td class="wip">规划</td><td>依赖判断聚合与导出</td></tr>
              <tr><td><b>多源图谱</b></td><td class="no">未做</td><td>当前只有 arXiv + OpenAlex</td></tr>
            </tbody>
          </table>
        </div>
        <p>收窄不是放弃，而是先让主链可验证。方法论给出方向，产品给出可交付的最小闭环。</p>
      `
    },
    {
      id: "revisions",
      num: "06",
      title: "被保留与被修正的判断",
      html: `
        <h3>保留</h3>
        <ul>
          <li>判断必须带出处，不能只有转述。</li>
          <li>没读到的东西要可见，不能只报召回率。</li>
          <li>变更必须留理由，不能覆盖历史。</li>
        </ul>
        <h3>修正</h3>
        <ul>
          <li>「完整引用图谱」改为「本周增量」：先让漏检可见，再谈覆盖。</li>
          <li>「自动生成综述」改为「判断聚合」：没有可核对的条目，综述只是漂亮文本。</li>
          <li>「对话式交互」改为「收件箱」：状态先于问题，减少人的认知负担。</li>
        </ul>
        <p>这些修正都能在当前代码里找到对应约束；它们不是文案变化，是产品边界的收紧。</p>
      `
    },
    {
      id: "archive",
      num: "07",
      title: "为什么保留这份稿",
      html: `
        <p>保留它，是为了让后来的人知道：产品不是从「做一个 AI 工具」开始的，而是从「判断如何被记住」开始的。很多现在看起来奇怪的设计——候选态、未定位、通道 skip、推翻必填理由——都可以在这里找到动机。</p>
        <p>如果你要改主链，先读<a href="./product-thesis.html">产品主旨</a>；如果你要改流程，读<a href="./usage-flow.html">一个人，一周</a>；如果你要判断某个功能该不该做，回到这份稿的三原则。</p>
      `
    }
  ]
};

export default [deployment, development, desktop, methodology].map((doc, i) => ({
  ...doc,
  order: i + 12
}));
