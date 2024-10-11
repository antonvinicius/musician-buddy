import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { InstrumentService } from "../../../music/domain/services/instrument.service";

@Controller('instrument')
@UseGuards(AuthGuard('jwt'))
export class InstrumentController {
    constructor(private readonly instrumentService: InstrumentService) { }

    @Get()
    async getInstruments() {
        return await this.instrumentService.getInstruments()
    }
}