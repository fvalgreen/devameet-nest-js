import { IsBoolean } from 'class-validator';
import { RoomMessageHelper } from '../helpers/room.messages.helper';
import { JoinRoomDto } from './joinroom.dto';

export class inRoom extends JoinRoomDto{
  @IsBoolean({ message: RoomMessageHelper.IN_ROOM_NOT_VALID })
  inRoom: boolean;
}