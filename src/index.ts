import { ChatOllama } from '@langchain/ollama';
import dayjs from 'dayjs';

function timeNow() {
  return dayjs().format('YYYY-MM-DD HH:mm:ss');
}

async function test() {
  const model = new ChatOllama({
    baseUrl: 'http://183.220.36.102:31131',
    model: 'phi4:latest',
    numCtx: 16384,
  });
  const result = await model.invoke([
    { role: 'system', content: 'XSea是一个性能测试平台，你是最熟悉XSea平台的小助手。之后可能会发给你XSea平台页面的Html代码。你需要帮助用户解答关于页面的交互操作问题。' },
    { role: 'system', content: `
下面是XSea产品的相关说明
XSea性能测试平台完整指南

一、产品核心定位
XSea是一个企业级性能测试服务平台,整合了脚本管理、数据工厂、测试计划、目标执行、测试记录、报告管理和定时任务等功能于一体。平台可模拟大规模并发用户的真实业务场景,帮助企业以较低的人力和资源成本完成性能测试,提前发现性能瓶颈,保障业务稳定性。

二、主要功能模块

脚本管理
支持类型：JMeter(v5.1)、Gatling、SeaMeter、Shell等
在线编辑与调试能力
支持文件夹管理,最多4层目录结构
脚本参数化和数据驱动能力
变量统一管理和复用
支持域名绑定和环境配置
数据工厂
集中管理测试数据文件
支持参数化文件和非参数化文件
文件拆分与压力机分发控制
支持CSV、TXT等多种格式
三方依赖包统一管理
测试计划
完整项目生命周期管理
支持自定义字段扩展
多维度计划进度跟踪
测试资产统一管理
支持模板定制和复用
目标执行
多场景类型支持(基准/单场景/混合/稳定性)
复杂压测模型配置
动态流量调整能力
多维度监控指标采集
前后置任务支持
熔断规则设置
三、核心能力详解

监控体系
数据采集:
Java探针：应用性能数据采集
ProcessAgent：主机资源监控
中间件监控：MySQL、Redis、Kafka等
压力机监控：发压机器状态
指标维度:

业务指标：TPS、响应时间、成功率等
资源指标：CPU、内存、网络IO等
中间件指标：连接池、队列等
链路数据：调用链路和耗时分布
性能分析
代码级性能瓶颈定位
全链路调用分析
慢SQL分析
系统资源使用分析
GC分析
线程分析
压测控制
并发数阶梯式增长
定时启停控制
动态调整压测参数
多维度熔断保护
异常自动停止
四、使用流程详解

环境准备
(1) 探针部署
Java应用：安装JavaAgent探针
主机监控：部署ProcessAgent
中间件监控：安装对应Exporter
压力机部署：独立压力机程序部署
(2) 探针配置

选择环境和应用
配置采集参数
验证数据上报
检查监控指标
脚本准备
(1) 脚本开发规范
JMeter脚本要求:
线程组名称不能重复
同一线程组内事务名不能重复
避免特殊字符($、&等)
断言需放在请求下而非事务下
建议Stop thread on EOF设置为false
建议HTTP头管理器放在线程组下
Gatling脚本要求:
支持HTTP协议测试
支持Scala语言脚本
提供基础脚本模板
(2) 脚本调试

调试参数配置
并发数:1
循环次数:1
数据量:最多100条
超时时间:120秒
调试验证项
请求成功率
响应数据正确性
断言结果
变量提取
关联参数
目标配置
(1) 基础配置
选择测试类型
关联测试脚本
配置执行环境
设置超时时间
配置思考时间
(2) 压测模型

配置并发用户数
设置施压时间
配置递增策略
设置维持时长
RPS限制
(3) 监控配置

选择监控对象
配置采集指标
设置采样间隔
配置监控时长
(4) 评估配置

设置业务指标要求
配置资源阈值
设置中间件指标
配置熔断规则
五、最佳实践

性能测试方法
(1) 基准测试
目的：验证单个接口性能
方法：1并发反复调用
关注：平均响应时间
建议：系统无压力情况
(2) 单场景测试

目的：评估单业务承载力
方法：逐步增加并发
关注：性能拐点
建议：独立验证单功能
(3) 混合场景测试

目的：模拟真实业务压力
方法：按业务比例加压
关注：系统整体表现
建议：贴近生产环境
(4) 稳定性测试

目的：验证长期运行稳定性
方法：持续中等压力
关注：资源使用趋势
建议：建议7*24小时
问题定位方法
(1) 响应时间分析
查看TPS和RT趋势
分析请求延迟分布
定位最慢请求
查看调用链路
(2) 资源分析

监控CPU使用率
查看内存使用情况
分析网络IO
检查磁盘IO
(3) 应用分析

查看GC情况
分析线程状态
查看连接池
分析慢SQL
六、常见问题处理

脚本相关
调试失败:检查依赖和配置
本地成功平台失败:检查环境差异
数据文件问题:验证格式和编码
变量提取失败:检查提取规则
压测相关
并发上不去:检查资源配置
指标波动大:分析干扰因素
数据不准确:验证采集配置
请求超时:分析瓶颈原因
监控相关
数据未采集:检查探针状态
指标不准确:验证计算规则
数据延迟:检查网络状态
存储问题:清理历史数据
七、数据分析报告

报告生成
支持自动生成报告
可自定义报告模板
支持多记录聚合
支持数据对比分析
报告内容
测试结论
执行信息
性能指标
监控数据
问题记录
优化建议
八、平台扩展集成

OpenAPI接口
完整的REST接口
标准的鉴权机制
详细的接口文档
Java SDK支持
其他集成
CI/CD流程集成
监控系统对接
告警通知推送
数据推送对接
通过这个完整的性能测试平台,企业可以:

降低性能测试成本
提升测试效率
规范测试流程
沉淀测试经验
及早发现问题
保障系统稳定
平台提供了丰富的功能和工具,可以满足从场景设计、执行测试到分析优化的全流程需求。通过持续的性能测试和优化,确保系统能够稳定承载业务压力。
` },
    { role: 'system', content: `用户当前页面地址是：https://xseav4.perfma-poc.com/822313712173449216/product， 用户当前的html页面代码是：
<html><head>
  
  
  
  
  
  
  
  
  
  
  <title>产品 - XSea性能测试服务</title>
</head>

<body>
  
  <div id="header-wrapper" style="display:block">
    <div id="paas-header"><div> <span>XSea性能测试服务</span> <div id="paas-header-custom"></div> <div class="select-content"><div>初始环境</div> <span class="select-arrow"><svg class="select-icon"></svg></span> </div>    <a href="/docs"></a>    <div class="close-content"><svg class="close-icon"></svg></div> <div id="scroll-box-paas"><ul> <li> <span>Elasticsearch实例[10.10.30.103]磁盘剩余空间小于30%，请检查磁盘空间并扩容</span> </li></ul> <ul> <li> <span>Elasticsearch实例[10.10.30.103]磁盘剩余空间小于30%，请检查磁盘空间并扩容</span> </li></ul></div></div></div>
    <div id="header-hidden"></div>
  </div>
  <div><section><aside><div><ul><li class="ant-menu-item-selected"><div>产品</div></li><li><div>问题</div></li><li><div>统计</div></li><li><div>压力机</div></li><li><div>配置中心</div></li></ul></div></aside><main><div class="ant-spin-nested-loading"><div><span><button><span>列表展示</span></button><button><span>新建产品</span></button></span><div class="ant-list-grid"><div class="ant-spin-nested-loading"><div>新建产品<h3><span>啊飒飒的方法</span></h3><p>1112</p><p>未进行目标执行，请通过“<span>计划</span>”执行目标</p><div class="ant-row-flex ant-row-flex-space-between"><div><p>0</p><h4>脚本</h4></div><div><p>0</p><h4>计划</h4></div><div><p>0</p><h4>问题</h4></div></div><h3><span>45667</span></h3><p>111</p><p>未进行目标执行，请通过“<span>计划</span>”执行目标</p><div class="ant-row-flex ant-row-flex-space-between"><div><p>0</p><h4>脚本</h4></div><div><p>0</p><h4>计划</h4></div><div><p>0</p><h4>问题</h4></div></div><h3><span>1212</span></h3><p>33</p><p>未进行目标执行，请通过“<span>计划</span>”执行目标</p><div class="ant-row-flex ant-row-flex-space-between"><div><p>0</p><h4>脚本</h4></div><div><p>0</p><h4>计划</h4></div><div><p>0</p><h4>问题</h4></div></div><h3><span>脚本-目标同步逻辑验证</span></h3><p>脚本-目标同步逻辑验证</p><canvas id="canvas_1"></canvas><div style="visibility:hidden"> </div><div class="ant-row-flex ant-row-flex-space-between"><div><p>4</p><h4>脚本</h4></div><div><p>2</p><h4>计划</h4></div><div><p>0</p><h4>问题</h4></div></div><h3><span>演示产品</span></h3><p>用于演示产品功能。</p><canvas id="canvas_2"></canvas><div style="visibility:hidden"> </div><div class="ant-row-flex ant-row-flex-space-between"><div><p>10</p><h4>脚本</h4></div><div><p>2</p><h4>计划</h4></div><div><p>0</p><h4>问题</h4></div></div><h3><span>ABB</span></h3><p>未进行目标执行，请通过“<span>计划</span>”执行目标</p><div class="ant-row-flex ant-row-flex-space-between"><div><p>0</p><h4>脚本</h4></div><div><p>0</p><h4>计划</h4></div><div><p>0</p><h4>问题</h4></div></div><h3><span>产品列表查询</span></h3><p>未进行目标执行，请通过“<span>计划</span>”执行目标</p><div class="ant-row-flex ant-row-flex-space-between"><div><p>0</p><h4>脚本</h4></div><div><p>0</p><h4>计划</h4></div><div><p>0</p><h4>问题</h4></div></div><h3><span>压测</span></h3><p>未进行目标执行，请通过“<span>计划</span>”执行目标</p><div class="ant-row-flex ant-row-flex-space-between"><div><p>0</p><h4>脚本</h4></div><div><p>0</p><h4>计划</h4></div><div><p>0</p><h4>问题</h4></div></div></div></div></div>当前 1 - 8 条 &nbsp;&nbsp; 共 17 条 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<ul><li class="ant-pagination-disabled"></li><li class="ant-pagination-item-active"><a>1</a></li><li><a>2</a></li><li><a>3</a></li></ul></div></div></main></section></div>
<div><ul><li class="active-item">初始环境 </li></ul></div><div><a><div> TestMa 质量效能平台</div></a><a href="http://10.10.30.103:8086"><div> XSky 统一监控服务</div></a><a href="http://10.10.30.103:8081"><div> XSea 性能测试服务</div></a><a href="http://10.10.30.103:8087"><div> XWind 性能风险巡检与诊断平台</div></a> <a href="http://10.10.30.103:8083">查看详情</a> </div><div>jimao <a href="http://10.10.30.103:8083/basic-info"><div> <span>个人中心</span></div></a> <a href="http://10.10.30.103:8083/product"><div> <span>平台管理</span></div></a>  <span>退出登录</span></div>


</body></html>
` },
    { role: 'user', content: '给我产品列表，和菜单列表' },
  ]);
  console.log(result.content);
}

async function main() {
  await test();
}

main();
