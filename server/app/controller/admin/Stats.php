<?php

declare(strict_types=1);

namespace app\controller\admin;

use app\common\controller\AdminController;
use app\service\StatsService;
use think\response\Json;

class Stats extends AdminController
{
    protected StatsService $service;

    public function __construct()
    {
        parent::__construct();
        $this->service = new StatsService();
    }

    /**
     * 商城概况
     */
    public function overview(): Json
    {
        $range = $this->request->get('range', 'today');
        $start = $this->request->get('start', '');
        $end   = $this->request->get('end', '');
        $data  = $this->service->overview($range, $start, $end);
        return $this->ok($data);
    }

    /**
     * 交易分析漏斗
     */
    public function trade(): Json
    {
        $range = $this->request->get('range', 'today');
        $start = $this->request->get('start', '');
        $end   = $this->request->get('end', '');
        $data  = $this->service->tradeFunnel($range, $start, $end);
        return $this->ok($data);
    }

    /**
     * 商品分析
     */
    public function goods(): Json
    {
        $range   = $this->request->get('range', 'today');
        $start   = $this->request->get('start', '');
        $end     = $this->request->get('end', '');
        $keyword = $this->request->get('keyword', '');
        $data    = $this->service->goodsAnalysis($range, $start, $end, $keyword);
        return $this->ok($data);
    }

    /**
     * 网站分析指标 + 趋势
     */
    public function web(): Json
    {
        $range = $this->request->get('range', 'today');
        $start = $this->request->get('start', '');
        $end   = $this->request->get('end', '');
        $data  = $this->service->webOverview($range, $start, $end);
        return $this->ok($data);
    }

    /**
     * 新老访客统计
     */
    public function webVisitors(): Json
    {
        $range = $this->request->get('range', 'today');
        $start = $this->request->get('start', '');
        $end   = $this->request->get('end', '');
        $data  = $this->service->webVisitors($range, $start, $end);
        return $this->ok($data);
    }

    /**
     * 着陆页面 TOP10
     */
    public function webTopPages(): Json
    {
        $range = $this->request->get('range', 'today');
        $start = $this->request->get('start', '');
        $end   = $this->request->get('end', '');
        $data  = $this->service->webTopPages($range, $start, $end);
        return $this->ok($data);
    }

    /**
     * 汇总分析
     */
    public function summary(): Json
    {
        $range = $this->request->get('range', 'today');
        $start = $this->request->get('start', '');
        $end   = $this->request->get('end', '');
        $data  = $this->service->summary($range, $start, $end);
        return $this->ok($data);
    }
}
