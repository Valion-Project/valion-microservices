import { Controller } from '@nestjs/common';
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {EventsService} from "./events.service";
import {CreateEventAddDto} from "./dto/create-event-add.dto";
import {CreateEventRedeemDto} from "./dto/create-event-redeem.dto";

@Controller('events')
export class EventsController {

  constructor(private eventsService: EventsService) {}

  @MessagePattern('create_event_add')
  async createEventAdd(data: CreateEventAddDto) {
    try {
      return await this.eventsService.createEventAdd(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('create_event_redeem')
  async createEventRedeem(data: CreateEventRedeemDto) {
    try {
      return await this.eventsService.createEventRedeem(data);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_events_by_company_id')
  async findByCompanyId(data: { companyId: number }) {
    try {
      return await this.eventsService.findByCompanyId(data.companyId);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_events_by_branch_id')
  async findByBranchId(data: { branchId: number }) {
    try {
      return await this.eventsService.findByBranchId(data.branchId);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_events_by_operator_user_id')
  async findByOperatorUserId(data: { operatorUserId: number }) {
    try {
      return await this.eventsService.findByOperatorUserId(data.operatorUserId);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }

  @MessagePattern('find_events_by_client_id')
  async findByClientId(data: { clientId: number }) {
    try {
      return await this.eventsService.findByClientId(data.clientId);
    } catch (err) {
      throw new RpcException(err.response);
    }
  }
}
