import { Body, Controller, Delete, Get, HttpCode, Param, Post, Request } from '@nestjs/common';
import { MeetService } from './meet.service';
import { GetMeetDto } from './dtos/getmeet.dto';
import { CreateMeetDto } from './dtos/createmeet.dto';

@Controller('meet')
export class MeetController {
  constructor(
    private readonly meetService: MeetService
  ){}

  @Get()
  async getUser(@Request() req){
    const { userId } = req?.user;

    const result = await this.meetService.getMeetsByUser(userId);

    return result.map(meet => ({
      id: meet._id.toString(),
      name: meet.name,
      color: meet.color,
      link: meet.link
    }) as GetMeetDto);
  }

  @Post()
  async createMeet(@Request() req, @Body() dto: CreateMeetDto){
    const {userId} = req?.user;

    await this.meetService.createMeet(userId, dto);
  }

  @Delete(':id')
  async deleteMeet(@Request() req, @Param() params){
    const {userId} = req?.user;
    const {id} = params;

    await this.meetService.deleteMeetByUser(userId, id);
  }
}
