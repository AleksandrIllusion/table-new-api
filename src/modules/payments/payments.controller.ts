import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PaymentsService } from "./payments.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
@Controller("payments")
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}
  @Get() findAll() { return this.service.findAll(); }
  @UseGuards(JwtAuthGuard) @Post("create")
  create(@Body() dto: CreatePaymentDto) { return this.service.create(dto); }
}
