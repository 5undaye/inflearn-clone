import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { BatchService } from './batch.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Controller('batch')
@UseGuards(AccessTokenGuard)
export class BatchController {
    constructor(private readonly batchService: BatchService) {}

    @Post('payments-stats')
    async runPaymentStats(@Query('date') date?: string) {
        return await this.batchService.runManualStats(date);
    }
}
