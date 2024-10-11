import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { ApiResponse } from "src/shared/utils/response.util";

@Injectable()
export class InstrumentService {
    constructor(private readonly prismaService: PrismaService) { }

    async getInstruments(): Promise<ApiResponse> {
        const instruments = await this.prismaService.instrument.findMany()

        return {
            errors: [],
            message: "Instruments fetched successfully",
            statusCode: 200,
            data: instruments
        }
    }
}