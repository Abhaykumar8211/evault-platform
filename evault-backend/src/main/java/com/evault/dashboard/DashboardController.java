package com.evault.dashboard;

import com.evault.common.ApiResponse;
import com.evault.dashboard.dto.DashboardChartsResponse;
import com.evault.dashboard.dto.DashboardStatsResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStats() {
        DashboardStatsResponse stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats, "Dashboard statistics retrieved"));
    }

    @GetMapping("/charts")
    public ResponseEntity<ApiResponse<DashboardChartsResponse>> getCharts() {
        DashboardChartsResponse charts = dashboardService.getDashboardCharts();
        return ResponseEntity.ok(ApiResponse.success(charts, "Dashboard analytics datasets retrieved"));
    }
}
